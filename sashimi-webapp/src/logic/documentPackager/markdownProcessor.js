// Import highlight.js module for code highlighting
const hljs = require('highlight.js'); // https://highlightjs.org/

// Import Markdown-It module for markdown processing
const md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const val = hljs.highlight(lang, str, true).value;
        return `<pre class="hljs"><code>${val}</code></pre>`;
      } catch (__) { return ''; }
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Importing markdown-it-katex plugin for parsing LaTeX mathematical forumla
const mk = require('markdown-it-katex');

// Getting markdown-it to use plugins
// For KaTeX
md.use(mk);
// For Highlightjs
md.use(require('markdown-it-highlightjs'), { auto: true, code: true });

const validateData = function validateData(data) {
  return data || '';
};

const markdownProcessor = {
  process: function process(data) {
    return md.render(validateData(data));
  }
};

module.exports = markdownProcessor;
