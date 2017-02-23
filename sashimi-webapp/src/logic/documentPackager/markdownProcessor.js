// Imports:
// Markdown-It module for markdown processing
import MarkdownIt from 'markdown-it';
// Code highlighting plugins
import hljs from 'highlight.js'; // https://highlightjs.org/
import mh from 'markdown-it-highlightjs';
// Importing markdown-it-katex plugin for parsing LaTeX mathematical forumla
import mk from 'markdown-it-katex';

const md = new MarkdownIt({
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

// Getting markdown-it to use plugins
// For KaTeX
md.use(mk);
// For Code Highlighting
md.use(mh, { auto: true, code: true });

const validateData = function validateData(data) {
  return data || '';
};

export default {
  process: function process(data) {
    return md.render(validateData(data));
  }
};
