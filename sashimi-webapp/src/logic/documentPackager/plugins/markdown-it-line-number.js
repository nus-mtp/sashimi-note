function injectDataLine(tokens, idx, options, env, slf) {
  if (tokens[idx].map && tokens[idx].level === 0) {
    const lineStart = tokens[idx].map[0] + 1;
    const lineEnd = tokens[idx].map[1];
    tokens[idx].attrJoin('class', 'code-line');
    tokens[idx].attrSet('data-line-start', `${lineStart}`);
    tokens[idx].attrSet('data-line-end', `${lineEnd}`);
  }
  return slf.renderToken(tokens, idx, options, env, slf);
}

function dataLineInjector(md, options) {
  // Minimal line tracking by injecting only
  // the paragraph and header tag
  md.renderer.rules.paragraph_open = injectDataLine;
  md.renderer.rules.heading_open = injectDataLine;
}

export default dataLineInjector;
