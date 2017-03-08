const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

module.exports = {
  load(filename) {
    const stack = callsite();
    const callerFileName = stack[1].getFileName();
    const callerDirectory = path.dirname(callerFileName);

    return fs.readFileSync(`${callerDirectory}/${filename}.txt`, 'utf-8');
  }
};
