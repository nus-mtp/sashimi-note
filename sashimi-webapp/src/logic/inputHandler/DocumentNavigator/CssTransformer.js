const CssTransformer = function CssTransformer(element) {
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

CssTransformer.prototype.get = function get() {
  return `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
};

CssTransformer.prototype.set = function set(settings) {
  this.scale = settings.scale || this.scale;
  this.translateX = (settings.translateX != null) ? settings.translateX : this.translateX;
  this.translateY = (settings.translateY != null) ? settings.translateY : this.translateY;
  this.elementRef.style.transform = this.get();
};

export default CssTransformer;
