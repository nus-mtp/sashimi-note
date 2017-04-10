import elementUtils from 'src/helpers/elementUtils';
import core from './core';

const keyEventListener = function keyEventListener(event) {
  // TODO: Intercept command key for Mac too
  if (event.key === 'p' && event.ctrlKey) {
    event.preventDefault();
    this.print();
  }
};

const DocumentPrinter = function DocumentPrinter(elementRef, vueInstance, propName) {
  this.elementRef = elementRef;
  this.vueInstance = vueInstance;
  this.propName = propName;

  this.keyEventListener = keyEventListener.bind(this);

  this.setDomBehaviour();
};

DocumentPrinter.prototype.print = function print(markdownDataProp) {
  let markdownData = markdownDataProp;
  if (markdownData == null) {
    markdownData = this.vueInstance[this.propName];
  }
  core.print(markdownData);
};

DocumentPrinter.prototype.setDomBehaviour = function setDomBehaviour() {
  this.elementRef.addEventListener('keydown', this.keyEventListener);
};

DocumentPrinter.prototype.unsetDomBehaviour = function unsetDomBehaviour() {
  this.elementRef.removeEventListener('keydown', this.keyEventListener);
};

export default DocumentPrinter;
