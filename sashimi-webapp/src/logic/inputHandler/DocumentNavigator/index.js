import interact from 'interactjs';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';
import CssTransformer from './CssTransformer';

const guard = {
  translateY(translateY, parentEle) {
    const bottomLimit = (() => {
      const numberOfElement = parentEle.childNodes.length;
      const pageHeight = unitConverter.get(parentEle.childNodes[0].style.height, 'px', false);
      const pageMargin = unitConverter.get(getComputedStyle(parentEle.childNodes[0]).marginTop, 'px', false);
      return -(numberOfElement) * (pageHeight + pageMargin);
    })();
    if (translateY < bottomLimit) translateY = bottomLimit;
    if (translateY > 0) translateY = 0;
    return translateY;
  },
  translateX(translateX, parentEle) {
    const sideLimit = (() => {
      const pageWidth = unitConverter.get(parentEle.childNodes[0].style.width, 'px', false);
      return (pageWidth / 2);
    })();
    if (translateX < -sideLimit) translateX = -sideLimit;
    if (translateX > sideLimit) translateX = sideLimit;
    return translateX;
  },
  scale(scale) {
    if (scale < 0.05) scale = 0.05;
    if (scale > 15) scale = 15;
    return scale;
  }
};

// Interactions
const updateWindowSize = function updateWindowSize(event) {
  // Retrieve the resized width
  const marginWidth = 60;
  const width = {
    element: unitConverter.get(this.el.element.computedStyle.width, 'px', false),
    container: unitConverter.get(this.el.container.computedStyle.width, 'px', false)
  };
  // Resize the element's transformer
  this.transform.set({ scale: (width.container - marginWidth) / width.element });
};

const pointermove = function pointermove(event) {
  const moveSpeed = (1/this.transform.scale);
  const translateY = guard.translateY(this.transform.translateY + (event.dy * moveSpeed), this.el.container);
  let translateX = 0;
  if ((this.width.container) < this.width.element * this.transform.scale) {
    translateX = guard.translateX(this.transform.translateX + (event.dx * moveSpeed), this.el.container);
  }

  // translate the element
  this.transform.set({ translateX, translateY });
};

const interactZoom = function interactZoom(event) {
  if (!event.ds) event.ds = (-event.deltaY / 1000);
  let scale = this.transform.scale * (1 + event.ds);
  scale = guard.scale(scale);
  this.transform.set({ scale });
};

const mousewheel = function mousewheel(event) {
  event.preventDefault();
  if (event.ctrlKey) {
    interactZoom.call(this, event);
  } else {
    let translateY = this.transform.translateY - ((event.deltaY/4) * (1 / this.transform.scale));
    translateY = guard.translateY(translateY, this.el.container);
    this.transform.set({ translateY });
  }
};

/**
 * Document Navigator manage the input halding of Pages mode
 * @param {*} page
 * @param {*} containerCssSelector
 */
const DocumentNavigator = function DocumentNavigator(page, containerCssSelector, elementCssSelector) {
  // Initialise DocumentNavigator properties
  this.updateElementReference(containerCssSelector);
  this.transform = new CssTransformer(this.el.container);

  // Initialise document navigator
  // 1. Set viewport on init;
  updateWindowSize.call(this);

  // 2. Attach event listener;
  this.eventListeners = [{
    event: 'resize',
    fn: updateWindowSize.bind(this),
    target: window,
  }, {
    event: 'mousewheel',
    fn: mousewheel.bind(this),
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

  Object.keys(this.el).forEach((key) => {
    const elementReference = this.el[key];

    if (!elementReference.DocumentNavigator) {
      elementReference.DocumentNavigator = {};
    }
    const dn = elementReference.DocumentNavigator;
    dn.computedStyle = domUtils.getComputedStyle(elementReference);
  });
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
    onmove: pointermove.bind(this),
  })
  .gesturable({
    onmove: interactZoom.bind(this),
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
