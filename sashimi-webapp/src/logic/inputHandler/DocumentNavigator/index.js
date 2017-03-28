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
  const parentReference = this.el.parent;
  const computedStyle = domUtils.getComputedStyle(parentReference);

  // Store default parent reference properties before overwriting
  this.defaultProperties = {
    style: {
      top: computedStyle.top,
      bottom: computedStyle.bottom,
      left: computedStyle.left,
      right: computedStyle.right,
      position: computedStyle.position,
    },
    attribute: {
      touchEvent: parentReference.getAttribute('touch-event'),
    }
  };

  // Parent reference properties with the required one
  domUtils.overwriteStyle(parentReference.style, {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  });
  parentReference.setAttribute('touch-action', 'none');
};

DocumentNavigator.prototype.removeDomStyling = function removeDomStyling() {
  const parentReference = this.el.parent;

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
