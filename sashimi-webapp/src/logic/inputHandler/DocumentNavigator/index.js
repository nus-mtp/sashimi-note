import interact from 'interactjs';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';
import core from './core';
import CssTransformer from './CssTransformer';

/**
 * Document Navigator manage the input halding of Pages mode
 * @param {*} containerCssSelector
 */
const DocumentNavigator = function DocumentNavigator(containerCssSelector) {
  // Initialise DocumentNavigator properties
  this.updateElementReference(containerCssSelector);
  this.transform = new CssTransformer(this.el.container);

  // 1. Set viewport on init;
  this.updateElementWidth();

  // 2. Attach event listener;
  this.eventListeners = [{
    event: 'resize',
    fn: this.updateElementWidth,
    target: window,
  }, {
    event: 'mousewheel',
    fn: core.mousewheel.bind(this),
    target: this.el.parent,
    boolean: false
  }];
  this.addListeners();
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

DocumentNavigator.prototype.addListeners = function addListeners() {
  this.el.parent.setAttribute('touch-event', 'none');
  this.eventListeners.forEach((listener) => {
    listener.target.addEventListener(listener.event, listener.fn, listener.boolean);
  });
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
};

DocumentNavigator.prototype.removeListeners = function removeListeners() {
  this.el.parent.removeAttribute('touch-event');
  this.interactable.unset();

  this.eventListeners.forEach((listener) => {
    listener.target.removeEventListener(listener.event, listener.fn);
  });
};

export default DocumentNavigator;
