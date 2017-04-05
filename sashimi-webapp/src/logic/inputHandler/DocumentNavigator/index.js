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
  };
};

DocumentNavigator.prototype.updateElementWidth = function updateElementWidth() {
  if (!this.width) this.width = {};
  Object.keys(this.el).forEach((key) => {
    const elementReference = this.el[key];
    const elementWidth = domUtils.getComputedStyle(elementReference).width;
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
    attribute: {
      touchEvent: this.el.parent.parentNode.parentNode.getAttribute('touch-action'),
    }
  };

  // Parent reference properties with the required one
  this.el.parent.parentNode.parentNode.setAttribute('touch-action', 'pan-x pan-y');
};

DocumentNavigator.prototype.removeDomStyling = function removeDomStyling() {
  const parentReference = this.el.parent.parentNode.parentNode;

  domUtils.overwriteStyle(parentReference.style, this.defaultProperties.style);

  if (this.defaultProperties.attribute.touchEvent) {
    parentReference.removeAttribute('touch-action');
  } else {
    parentReference.setAttribute('touch-action', this.defaultProperties.attribute);
  }
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

  this.interactable = interact(this.el.parent);
  this.interactable.draggable(this.eventHandler.settings.draggable);
  this.interactable.gesturable(this.eventHandler.settings.gesturable);

  this.eventListeners = [
    {
      event: 'mousewheel',
      fn: this.eventHandler.eventFn.mousewheel.bind(this),
      target: this.el.parent,
      boolean: false
    }, {
      event: 'pointerdown',
      fn: this.eventHandler.eventFn.pointer.down.bind(this),
      target: this.el.parent,
    }, {
      event: 'pointerup',
      fn: this.eventHandler.eventFn.pointer.up.bind(this),
      target: this.el.parent,
    }, {
      event: 'resize',
      fn: this.updateElementWidth.bind(this),
      target: window,
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
