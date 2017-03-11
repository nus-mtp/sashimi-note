const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

module.exports = {
  /**
   * A helper module that is used to load text file from the filesystem.
   * @param {string} filepath - filepath relative to the caller function.
   *                            The filepath shouldn't contain the leading .txt
   * @return {string} data - containing the text content of the file decoded with utf-8 format
   */
  load(filepath) {
    const stack = callsite();
    const callerFileName = stack[1].getFileName();
    const callerDirectory = path.dirname(callerFileName);

    return fs.readFileSync(`${callerDirectory}/${filepath}.txt`, 'utf-8');
  }
};
