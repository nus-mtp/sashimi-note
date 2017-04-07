/**
 * This is the Markdown-It module used for parsing markdown content and rendering
 * the content into HTML string, for use to be displayed on Viewer component
 * @return {string} returns the rendered HTML string
 */

// Imports:
// Markdown-It module for markdown processing
import MarkdownIt from 'markdown-it';
// Code highlighting plugins
import hljs from 'highlight.js'; // https://highlightjs.org/
import mdHighlight from 'markdown-it-highlightjs';
// Katex plugin for parsing LaTeX mathematical forumla
import mdKatex from 'markdown-it-katex';
// Table of Contents plugins
import mdAnchor from 'markdown-it-anchor';
import mdTOC from 'markdown-it-table-of-contents';
// ASCIIMath Plugin
import mdAsciiMath from './markdown-it-asciimath';
// Custom Fence Block Rule for textual Diagram representation
import mdDiagrams from './markdown-it-diagram';
// Custom conditional plugin
import mdConditional from './conditionalProcessor';


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
      } catch (error) { return ''; }
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Getting markdown-it to use plugins
// For KaTeX
md.use(mdKatex);
// For ASCIIMath
md.use(mdAsciiMath);
// For Code Highlighting
md.use(mdHighlight, { auto: true, code: true });
// For TOC generation
md.use(mdAnchor);
md.use(mdTOC);
// For drawing diagrams
md.use(mdDiagrams);
// For custom conditional plugin
md.use(mdConditional.hideShowPlugin);

const validateData = function validateData(data) {
  return data || '';
};

export default {
  process: function process(data) {
    return md.render(validateData(data));
  }
};
