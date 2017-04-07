import interact from 'interactjs';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';
import elementUtils from 'src/helpers/elementUtils';
import EventHM from './EventHandlerManager';
import CssTransformer from './CssTransformer';

/**
 * Document Navigator manage the input halding of Pages mode
 * @param {string | Element} targetReference - Receive either a string Id or an element reference.
 * @param {Element} resizeObserveTarget - If this element is provided, it will be
 *                                        used to track the change in document
 *                                        parent's width
 */
const DocumentNavigator = function DocumentNavigator(targetReference, resizeObserveTarget) {
  // Initialise DocumentNavigator properties
  this.updateElementReference(targetReference);
  this.transform = new CssTransformer(this.el.container);
  this.resizeObserveTarget = resizeObserveTarget || null;

  // 1. Set viewport on init;
  this.eventHandler = new EventHM(this);
  this.updateElementWidth();

  // 2. Set up event listener and DOM properties;
  this.setDomBehaviour();
};

DocumentNavigator.prototype.updateElementReference = function updateElementReference(targetReference) {
  const containerReference = elementUtils.resolveElement(targetReference);
  if (!containerReference) {
    throw new Error('Element provided to DocumentNavigator is not found at this moment');
  }

  this.el = {
    container: containerReference,
    parent: containerReference.parentNode,
    element: containerReference.childNodes[0],
    html: containerReference.ownerDocument.body.parentNode
  };
};

DocumentNavigator.prototype.updateElementWidth = function updateElementWidth() {
  if (!this.width) this.width = {};
  Object.keys(this.el).forEach((key) => {
    const elementReference = this.el[key];
    let elementWidth = domUtils.getComputedStyle(elementReference).width;
    if (elementWidth === 'auto') elementWidth = `${elementReference.scrollWidth}px`;
    this.width[key] = unitConverter.get(elementWidth, 'px', false);
  });

  this.eventHandler.eventFn.dom.resize.call(this);
};

DocumentNavigator.prototype.setDomBehaviour = function setDomBehaviour() {
  this.addDomStyling();
  this.addEventListeners();
};

DocumentNavigator.prototype.unsetDomBehaviour = function setDomBehaviour() {
  this.removeEventListeners();
  this.removeDomStyling();
};


DocumentNavigator.prototype.addDomStyling = function addDomStyling() {
  // Reset parent height to force DOM relayout
  // [1] Initialise layout properties
  const containerReference = this.el.container;
  const containerRefStyle = domUtils.getComputedStyle(containerReference);
  containerReference.documentNavigator = {
    originalStyle: {
      height: containerRefStyle.height,
      width: containerRefStyle.width
    }
  };

  setTimeout(() => {
    // [2] Initialise layout properties
    let tempContainerHeight = domUtils.getComputedStyle(this.el.container).height;
    let tempContainerWidth = domUtils.getComputedStyle(this.el.element).width;

    if (tempContainerHeight === 'auto') tempContainerHeight = this.el.container.scrollHeight;
    if (tempContainerWidth === 'auto') tempContainerWidth = this.el.element.scrollWidth;

    tempContainerHeight = parseFloat(tempContainerHeight) + 500;
    tempContainerWidth = parseFloat(tempContainerWidth);
    containerReference.documentNavigator.originalStyle.height = tempContainerHeight;
    containerReference.documentNavigator.originalStyle.width = tempContainerWidth;

    const renderHeight = `${tempContainerHeight * this.transform.scale}px`;
    const renderWidth = `${tempContainerWidth * this.transform.scale}px`;
    this.el.parent.style.height = renderHeight;
    this.el.parent.style.width = renderWidth;
  }, 1000);

  // Store default parent reference properties before overwriting
  this.defaultProperties = {
    html: {
      attribute: {
        touchEvent: this.el.html.getAttribute('touch-action'),
      }
    },
    parent: {
      style: {
        padding: this.el.parent.style.padding,
        margin: this.el.parent.style.margin,
        width: this.el.parent.style.width
      }
    },
    container: {
      style: {
        /* eslint quote-props: 0 */
        width: this.el.container.style.width,
        margin: this.el.container.style.margin,
        position: this.el.container.style.position,
        'transform-origin': this.el.container.style['transform-origin']
      }
    }
  };

  const newProperties = {
    html: {
      attribute: {
        touchEvent: 'pan-x pan-y',
      }
    },
    parent: {
      style: {
        padding: 0,
        margin: '0 auto',
        width: '100%',
      }
    },
    container: {
      style: {
        /* eslint quote-props: 0 */
        width: '1px',
        margin: '0 auto',
        position: 'relative',
        'transform-origin': 'center top',
      }
    }
  };

  Object.keys(newProperties)
        .forEach((elementKey) => {
          if (newProperties[elementKey].style) {
            domUtils.overwriteStyle(this.el[elementKey].style, newProperties[elementKey].style);
          }
          if (newProperties[elementKey].attribute) {
            Object.keys(newProperties[elementKey].attribute)
                  .forEach((attrKey) => {
                    this.el[elementKey].setAttribute(attrKey, newProperties[elementKey].attribute[attrKey]);
                  });
          }
        });
};

DocumentNavigator.prototype.removeDomStyling = function removeDomStyling() {
  Object.keys(this.defaultProperties)
        .forEach((elementKey) => {
          if (this.defaultProperties[elementKey].style) {
            domUtils.overwriteStyle(this.el[elementKey].style, this.defaultProperties[elementKey].style);
          }
          if (this.defaultProperties[elementKey].attribute) {
            Object.keys(this.defaultProperties[elementKey].attribute)
                  .forEach((attrKey) => {
                    this.el[elementKey].setAttribute(attrKey, this.defaultProperties[elementKey].attribute[attrKey]);
                  });
          }
        });
};

DocumentNavigator.prototype.addEventListeners = function addEventListeners() {
  this.eventInstance = {
    pointers: {},
    numPointers: 0,
    state: {
      action: null,
      pointerType: null
    }
  };

  const iframeDoc = this.el.parent.ownerDocument;
  const iframeWin = iframeDoc.defaultView || iframeDoc.parentWindow;
  this.interactable = interact(this.el.html);
  this.interactable.draggable(this.eventHandler.settings.draggable);
  this.interactable.gesturable(this.eventHandler.settings.gesturable);

  this.eventListeners = [
    {
      event: 'DOMMouseScroll',
      fn: this.eventHandler.eventFn.mousewheel.bind(this),
      target: iframeWin,
      boolean: false
    }, {
      event: 'mousewheel',
      fn: this.eventHandler.eventFn.mousewheel.bind(this),
      target: iframeWin,
      boolean: false
    }, {
      event: 'pointerdown',
      fn: this.eventHandler.eventFn.pointer.down.bind(this),
      target: iframeWin,
    }, {
      event: 'pointerup',
      fn: this.eventHandler.eventFn.pointer.up.bind(this),
      target: iframeWin,
    }, {
      event: 'resize',
      fn: this.updateElementWidth.bind(this),
      target: iframeWin,
    }
  ];

  // Add resize observer if it exist
  if (this.resizeObserveTarget) {
    this.eventListeners.push({
      event: 'transitionend',
      fn: this.updateElementWidth.bind(this),
      target: this.resizeObserveTarget
    });
  }

  this.eventListeners.forEach((listener) => {
    listener.target.addEventListener(listener.event, listener.fn, listener.boolean);
  });
};

DocumentNavigator.prototype.removeEventListeners = function removeEventListeners() {
  this.interactable.unset();

  this.eventListeners.forEach((listener) => {
    listener.target.removeEventListener(listener.event, listener.fn);
  });
};

export default DocumentNavigator;
