//  Import module
const EventEmitter2 = require('eventemitter2');

const documentFormatter = new EventEmitter2();
let content = '';

documentFormatter.set = function set(newContent) {
  content = newContent;
  documentFormatter.emit('changed', content);
};

documentFormatter.get = function get() {
  return content;
};

module.exports = documentFormatter;
