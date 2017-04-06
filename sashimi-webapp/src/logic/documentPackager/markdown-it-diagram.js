/**
  * Customises Markdown-it renderer fence block rule to return custom pre tags
  * when fence blocks with 'sequence', 'flow', 'mermaid' and 'graphviz' is found.
  * This is to prepare the content for diagrams.js to draw the UML diagrams.
  * @param {MarkdownIt} md - MarkdownIt object containing parsed data of markdown content
  * @param {array} options - array containing custom parsing/rending options for use by Markdown-it renderer
  */

// Import HTML entity decoding library to decode for possible XSS insertion
import heParser from 'he';

// Helper filter function to filter out possible XSS using diagrams
function filter(content) {
  const regex = /:>(.*)(?::|&colon;).*/gm;
  const jsString = 'javascript';
  let array;
  let parsedString;
  while ((array = regex.exec(content)) !== null) {
    parsedString = heParser.decode(array[1]);
    if (jsString.toUpperCase() === parsedString.toUpperCase()) {
      const newRegex = new RegExp(`:>${array[1]}.*`);
      content = content.replace(newRegex, '');
    }
  }
  return content;
}

export default function setup(md, options) {
  const defaultRender = md.renderer.rules.fence;
  const diagramsLib = ['sequence', 'flow', 'mermaid', 'graphviz'];

  /* eslint no-undef: 0 */
  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    token.content = filter(token.content);
    if (diagramsLib.includes(token.info)) {
      return `<pre class="${token.info}">${token.content}</pre>`;
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, opts, env, self);
  };
}
