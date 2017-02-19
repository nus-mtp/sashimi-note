// Import Markdown-It module for markdown processing
const md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

const validateData = function validateData(data) {
  return data || '';
};

const markdownProcessor = {
  process: function process(data) {
    return md.render(validateData(data));
  }
};

module.exports = markdownProcessor;
