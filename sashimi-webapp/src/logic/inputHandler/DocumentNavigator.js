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
    return pageWidth/2;
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

const CssTransform = function CssTransform(settings) {
  if (settings == null) {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  } else {
    this.set(settings);
  }
  return this.get();
};

CssTransform.prototype.get = function get() {
  return `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
};

CssTransform.prototype.set = function set(settings) {
  this.scale = settings.scale || this.scale;
  this.translateX = (settings.translateX != null) ? settings.translateX : this.translateX;
  this.translateY = (settings.translateY != null) ? settings.translateY : this.translateY;
  return this.get();
};

CssTransform.prototype.applyTransformation = function applyTransformation(element) {
  let elementToApply = element;
  if (typeof element === 'string') {
    elementToApply = document.querySelector(element);
  }
  elementToApply.style.transform = this.get();
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

  this.pointerData.transform.scale = (this.width.container - 60) / this.width.element;
  this.cssTransformer.set(this.pointerData.transform);
  this.cssTransformer.applyTransformation(this.el.container);
};

const pointers = {};
const pointersPrev = {};

const pointerdown = function pointerdown(event) {
  event.preventDefault();
  pointers[event.pointerId] = event;
  pointersPrev[event.pointerId] = {
    x: event.x,
    y: event.y
  };
};
const pointerup = function pointerup(event) {
  event.preventDefault();
  delete pointers[event.pointerId];
};
const pointermove = function pointermove(event) {
  if (Object.keys(pointers).length > 0) {
    pointers[event.pointerId] = event;
    const moveX = pointers[event.pointerId].x - pointersPrev[event.pointerId].x;
    const moveY = pointers[event.pointerId].y - pointersPrev[event.pointerId].y;
    pointersPrev[event.pointerId].x = pointers[event.pointerId].x;
    pointersPrev[event.pointerId].y = pointers[event.pointerId].y;

    const moveSpeed = (1/this.cssTransformer.scale);
    const newX = translateXGuard(this.cssTransformer.translateX + (moveX * moveSpeed), this.el.container);
    const newY = translateYGuard(this.cssTransformer.translateY + (moveY * moveSpeed), this.el.container);
    this.pointerData.transform.translateX = newX;
    this.pointerData.transform.translateY = newY;

    this.cssTransformer.set({
      translateX: newX,
      translateY: newY
    });
    this.cssTransformer.applyTransformation(this.el.container);
  }
};
const mousewheel = function mousewheel(event) {
  event.preventDefault();
  if (event.ctrlKey) {
    this.pointerData.transform.scale *= (1 - (event.deltaY / 1000));
    this.pointerData.transform.scale = scaleGuard(this.pointerData.transform.scale);
    this.cssTransformer.set(this.pointerData.transform);
    this.cssTransformer.applyTransformation(this.el.container);
  } else {
    this.pointerData.transform.translateY -= (event.deltaY/4) * (1/this.cssTransformer.scale);
    this.pointerData.transform.translateY = translateYGuard(this.pointerData.transform.translateY, this.el.container);
    this.cssTransformer.set(this.pointerData.transform);
    this.cssTransformer.applyTransformation(this.el.container);
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
  this.el.container.computedStyle = domUtils.getComputedStyle(this.el.container.parentNode);
  this.el.element.computedStyle = domUtils.getComputedStyle(this.el.element);

  // Builds document properties
  this.page = page;
  this.width = {
    element: unitConverter.get(this.page.width, 'px', false),
    container: unitConverter.get(this.el.container.computedStyle.width, 'px', false)
  };

  // Initialise pointers information
  this.pointerData = {
    transform: {
      scale: 1,
      translateX: 0,
      translateY: 0
    },
    pointer: {
      prev: {
        x: 0,
        y: 0
      },
      now: {
        x: 0,
        y: 0
      }
    }
  };
  this.cssTransformer = new CssTransform(this.pointerData.transform);

  // Initialise document navigator
  // 1. Set viewport on init;
  windowResize.call(this);

  // 2. Attach event listener;
  this.el.container.parentNode.addEventListener('mousewheel', mousewheel.bind(this), false);
  this.el.container.parentNode.addEventListener('pointerdown', pointerdown.bind(this));
  this.el.container.parentNode.addEventListener('pointerleave', pointerup.bind(this));
  this.el.container.parentNode.addEventListener('pointerup', pointerup.bind(this));
  this.el.container.parentNode.addEventListener('pointermove', pointermove.bind(this));
  window.addEventListener('resize', windowResize.bind(this));
};

export default DocumentNavigator;
