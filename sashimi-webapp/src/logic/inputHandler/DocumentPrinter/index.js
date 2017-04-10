import elementUtils from 'src/helpers/elementUtils';
import core from './core';

const keyEventListener = function keyEventListener(event) {
  if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
    // metaKey will match Window key and Mac's CMD key
    // TODO: Prevent Windows + P to execute print
    event.preventDefault();
    this.print();
  }
};

const DocumentPrinter = function DocumentPrinter(elementRef, vueInstance, propName) {
  this.elementRef = elementUtils.resolveElement(elementRef);
  this.vueInstance = vueInstance;
  this.propName = propName;

  this.keyEventListener = keyEventListener.bind(this);
  this.eventAttachedElements = [];

  this.setDomBehaviour();
};

DocumentPrinter.prototype.print = function print(markdownDataProp) {
  let markdownData = markdownDataProp;
  if (markdownData == null) {
    markdownData = this.vueInstance[this.propName];
  }
  core.print(markdownData);
};

DocumentPrinter.prototype.unsetDomBehaviour = function unsetDomBehaviour() {
  this.elementRef.removeEventListener('keydown', this.keyEventListener);
  this.eventAttachedElements.forEach((element) => {
    element.removeEventListener('keydown', this.keyEventListener);
  });
  this.eventAttachedElements = [];
};

DocumentPrinter.prototype.setDomBehaviour = function setDomBehaviour() {
  // Clear all previously added event listener;
  this.unsetDomBehaviour();

  this.elementRef.addEventListener('keydown', this.keyEventListener);

  const documentRef = this.elementRef.window.document || this.elementRef.contentWindow.ownerDocument;

  // Add event listener to all the iframe object below it
  setTimeout(() => {
    const iframeElements = documentRef.getElementsByTagName('iframe');
    for (let i = 0; i < iframeElements.length; i += 1) {
      const windowObj = iframeElements[i].contentWindow;
      this.eventAttachedElements.push(windowObj);
      windowObj.addEventListener('keydown', this.keyEventListener);
    }
  }, 1000);
  // Add small delay to wait for DOM to get ready
};


export default DocumentPrinter;
