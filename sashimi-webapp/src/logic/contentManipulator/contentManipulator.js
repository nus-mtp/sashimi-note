//Import modules
let eventEmitter2 = require('eventemitter2');

let contentManipulator = new eventEmitter2();
let content = '';

contentManipulator.set = function(newContent){
    content = newContent;
    contentManipulator.emit('changed', content);
};

contentManipulator.get = function(){
    return content;
};

module.exports = contentManipulator;
