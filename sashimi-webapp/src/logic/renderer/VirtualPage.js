function VirtualPageError(message) {
  this.name = 'VirtualPageError';
  this.message = message || 'Error with virtual page operation';
  this.stack = (new Error()).stack;
}
VirtualPageError.prototype = Object.create(Error.prototype);
VirtualPageError.prototype.constructor = VirtualPageError;


export default function VirtualPage(maxHeight) {
  this.maxHeight = maxHeight;
  this.filledHeight = 0;
  this.elements = [];
}
VirtualPage.prototype.add = function add(element) {
  if (element.height / this.maxHeight > 1) {
    throw new VirtualPageError('Element is larger than page');
  }

  const remainingHeight = this.maxHeight - (element.height + this.filledHeight);

  if (remainingHeight > 0) {
    this.elements.push(element);
    this.filledHeight += element.height;
    return remainingHeight;
  } else {
    throw new VirtualPageError('Page is full');
  }
};

VirtualPage.prototype.forceAdd = function forceAdd(element) {
  const remainingHeight = this.maxHeight - (element.height + this.filledHeight);
  this.elements.push(element);
  this.filledHeight += element.height;
  return remainingHeight;
};
