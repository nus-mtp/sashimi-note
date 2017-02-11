// Import Markdown-It module for markdown parsing and processing
const md = require('markdown-it')();

const markdownProcessor = {
  process: function process(data) {
    if (data === null || data === undefined) {
      data = '';
    }

    return md.render(data);
  },
};

module.exports = markdownProcessor;
