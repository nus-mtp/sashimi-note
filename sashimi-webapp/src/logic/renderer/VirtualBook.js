import VirtualPage from './VirtualPage';

export default function VirtualBook(renderHeight) {
  this.pages = [];
  this.renderHeight = renderHeight;
}

VirtualBook.prototype.add = function add(page) {
  this.pages.push(page);
};

VirtualBook.prototype.newPage = function newPage() {
  const page = new VirtualPage(this.renderHeight);
  this.add(page);
  return page;
};
