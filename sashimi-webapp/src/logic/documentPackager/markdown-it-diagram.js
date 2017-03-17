/**
  * Customises Markdown-it renderer fence block rule to return custom pre tags
  * when fence blocks with 'sequence', 'flow', 'mermaid' and 'graphviz' is found.
  * This is to prepare the content for diagrams.js to draw the UML diagrams.
  * @param {MarkdownIt} md - MarkdownIt object containing parsed data of markdown content
  * @param {array} options - array containing custom parsing/rending options for use by Markdown-it renderer
  */

export default function setup(md, options) {
  const defaultRender = md.renderer.rules.fence;

  /* eslint no-undef: 0 */
  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    if (token.info === 'sequence') {
      return `<pre class="sequence">${token.content}</pre>`;
    } else if (token.info === 'flow') {
      return `<pre class="flow">${token.content}</pre>`;
    } else if (token.info === 'mermaid') {
      return `<pre class="mermaid">${token.content}</pre>`;
    } else if (token.info === 'graphviz') {
      return `<pre class="graphviz">${token.content}</pre>`;
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, opts, env, self);
  };
}
