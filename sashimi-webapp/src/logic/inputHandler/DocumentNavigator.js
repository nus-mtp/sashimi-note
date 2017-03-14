import interact from 'interactjs';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';

function translateYGuard(translateY, parentEle) {
  const bottomLimit = (() => {
    const numberOfElement = parentEle.childNodes.length;
    const pageHeight = unitConverter.get(parentEle.childNodes[0].style.height, 'px', false);
    const pageMargin = unitConverter.get(getComputedStyle(parentEle.childNodes[0]).marginTop, 'px', false);
    return -(numberOfElement) * (pageHeight + pageMargin);
  })();
  if (translateY < bottomLimit) translateY = bottomLimit;
  if (translateY > 0) translateY = 0;
  return translateY;
}

function translateXGuard(translateX, parentEle) {
  const sideLimit = (() => {
    const pageWidth = unitConverter.get(parentEle.childNodes[0].style.width, 'px', false);
    return (pageWidth / 2);
  })();
  if (translateX < -sideLimit) translateX = -sideLimit;
  if (translateX > sideLimit) translateX = sideLimit;
  return translateX;
}

function scaleGuard(scale) {
  if (scale < 0.05) scale = 0.05;
  if (scale > 15) scale = 15;
  return scale;
}

const CssTransform = function CssTransform(element) {
  let elementToApply = element;
  if (typeof element === 'string') {
    elementToApply = document.querySelector(element);
  }

  // Check if element can be resolved
  if (!elementToApply) throw new Error(`Cannot find reference to element > ${element}`);

  this.elementRef = elementToApply;
  this.scale = 1;
  this.translateX = 0;
  this.translateY = 0;
  return this.get();
};

CssTransform.prototype.get = function get() {
  return `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
};

CssTransform.prototype.set = function set(settings) {
  this.scale = settings.scale || this.scale;
  this.translateX = (settings.translateX != null) ? settings.translateX : this.translateX;
  this.translateY = (settings.translateY != null) ? settings.translateY : this.translateY;
  this.elementRef.style.transform = this.get();
};

// Needed interaction
// 1. Panning
// 2. Zomming
// 3. Fit width to page
const windowResize = function windowResize(event) {
  // recompute parent and child width
  this.width = {
    element: unitConverter.get(this.page.width, 'px', false),
    container: unitConverter.get(this.el.container.computedStyle.width, 'px', false)
  };

  this.transform.set({ scale: (this.width.container - 60) / this.width.element });
};

const pointermove = function pointermove(event) {
  const moveSpeed = (1/this.transform.scale);
  const translateY = translateYGuard(this.transform.translateY + (event.dy * moveSpeed), this.el.container);
  let translateX = 0;
  if ((this.width.container) < this.width.element * this.transform.scale) {
    translateX = translateXGuard(this.transform.translateX + (event.dx * moveSpeed), this.el.container);
  }

  // translate the element
  this.transform.set({ translateX, translateY });
};

const interactZoom = function interactZoom(event) {
  if (!event.ds) event.ds = (-event.deltaY / 1000);
  let scale = this.transform.scale * (1 + event.ds);
  scale = scaleGuard(scale);
  this.transform.set({ scale });
};

const mousewheel = function mousewheel(event) {
  event.preventDefault();
  if (event.ctrlKey) {
    interactZoom.call(this, event);
  } else {
    let translateY = this.transform.translateY - ((event.deltaY/4) * (1 / this.transform.scale));
    translateY = translateYGuard(translateY, this.el.container);
    this.transform.set({ translateY });
  }
};

/**
 * Document Navigator manage the input halding of Pages mode
 * @param {*} page
 * @param {*} containerCssSelector
 * @param {*} elementCssSelector
 */
const DocumentNavigator = function DocumentNavigator(page, containerCssSelector, elementCssSelector) {
  // Obtains document details
  this.el = {
    container: document.querySelector(containerCssSelector),
    element: document.querySelector(elementCssSelector)
  };

  if (!this.el.container) throw new Error(`Unable to query "${containerCssSelector}"`);
  if (!this.el.element) throw new Error(`Unable to query "${elementCssSelector}"`);
  this.el.parent = this.el.container.parentNode;

  this.el.container.computedStyle = domUtils.getComputedStyle(this.el.parent);
  this.el.element.computedStyle = domUtils.getComputedStyle(this.el.element);

  // Builds document properties
  this.page = page;
  this.width = {
    element: unitConverter.get(this.page.width, 'px', false),
    container: unitConverter.get(this.el.container.computedStyle.width, 'px', false)
  };

  // Initialise pointers information
  this.transform = new CssTransform(this.el.container);

  // Initialise document navigator
  // 1. Set viewport on init;
  windowResize.call(this);

  // 2. Attach event listener;
  this.eventListeners = [{
    event: 'resize',
    fn: windowResize.bind(this),
    target: window,
  }, {
    event: 'mousewheel',
    fn: mousewheel.bind(this),
    target: this.el.parent,
    boolean: false
  }];
  this.addListeners();
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
