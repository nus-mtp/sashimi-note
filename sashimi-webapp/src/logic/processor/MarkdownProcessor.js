// Import Markdown-It module for markdown parsing and processing
const md = require('markdown-it')();

const markdownProcessor = {
  process: function process(data) {
    return md.render(data);
  },
};

module.exports = markdownProcessor;
