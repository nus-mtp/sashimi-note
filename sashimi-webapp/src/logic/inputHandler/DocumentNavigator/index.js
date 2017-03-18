import interact from 'interactjs';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';
import core from './core';
import CssTransformer from './CssTransformer';

/**
 * Document Navigator manage the input halding of Pages mode
 * @param {*} containerCssSelector
 * @param {Element} resizeObserveTarget - If this element is provided, it will be
 *                                        used to track the change in document
 *                                        parent's width
 */
const DocumentNavigator = function DocumentNavigator(containerCssSelector, resizeObserveTarget) {
  // Initialise DocumentNavigator properties
  this.updateElementReference(containerCssSelector);
  this.transform = new CssTransformer(this.el.container);
  this.resizeObserveTarget = resizeObserveTarget || null;

  // 1. Set viewport on init;
  this.updateElementWidth();

  // 2. Set up event listener and DOM properties;
  this.setDomBehaviour();
};

DocumentNavigator.prototype.updateElementReference = function updateElementReference(containerCssSelector) {
  const containerReference = document.querySelector(containerCssSelector);
  if (!containerReference) throw new Error(`Unable to query "${containerCssSelector}"`);

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

  core.updateWindowSize.call(this);
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
    numPointers: 0
  };

  this.eventListeners = [
    {
      event: 'mousewheel',
      fn: core.mousewheel.bind(this),
      target: this.el.parent,
      boolean: false
    }, {
      event: 'pointerdown',
      fn: (event) => {
        this.eventInstance.pointers[event.pointerId] = true;
        this.eventInstance.numPointers = Object.keys(this.eventInstance.pointers).length;
      },
      target: this.el.parent,
    }, {
      event: 'pointerup',
      fn: (event) => {
        delete this.eventInstance.pointers[event.pointerId];
        this.eventInstance.numPointers = Object.keys(this.eventInstance.pointers).length;
      },
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

  this.interactable = interact(this.el.parent)
  .draggable({
    inertia: {
      resistance: 5,
      minSpeed: 400,
      endSpeed: 20
    },
    onmove: core.pointermove.bind(this),
  })
  .gesturable({
    onmove: core.interactZoom.bind(this),
  });

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
