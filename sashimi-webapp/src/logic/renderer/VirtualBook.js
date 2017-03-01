export default function VirtualBook() {
  this.pages = [];
}

VirtualBook.prototype.add = function add(page) {
  this.pages.push(page);
};
