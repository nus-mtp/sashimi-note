//  Import module
const EventEmitter2 = require('eventemitter2');

const contentManipulator = new EventEmitter2();
let content = '';

contentManipulator.set = function set(newContent) {
  content = newContent;
  contentManipulator.emit('changed', content);
};

contentManipulator.get = function get() {
  return content;
};

module.exports = contentManipulator;
