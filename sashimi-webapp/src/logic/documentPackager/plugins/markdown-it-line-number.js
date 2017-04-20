
function injectWrapper(defaultRenderer = null) {
  const injectDataLine = function injectDataLine(tokens, idx, options, env, slf) {
    if (defaultRenderer) { // Run default renderer first if avaiable
      defaultRenderer(tokens, idx, options, env, slf);
    }

    if (tokens[idx].map && tokens[idx].level < 3) {
      const lineStart = tokens[idx].map[0] + 1;
      const lineEnd = tokens[idx].map[1];
      tokens[idx].attrJoin('class', 'code-line');
      tokens[idx].attrSet('data-line-start', `${lineStart}`);
      tokens[idx].attrSet('data-line-end', `${lineEnd}`);
    }

    return slf.renderToken(tokens, idx, options, env, slf);
  };

  return injectDataLine;
}

function dataLineInjector(md, options) {
  // Minimal line tracking by injecting only
  // the paragraph and header tag
  const injectionNames = [
    'paragraph_open',
    'heading_open',
    'blockquote_open',
    'table_open',
    'bullet_list_open',
    'list_item_open',
    'ordered_list_open',
    // 'container_classname_open', // not needed as it contained mostly markdown data
    'container_spoiler_open',
  ];

  injectionNames.forEach((name) => {
    const rule = md.renderer.rules[name];
    md.renderer.rules[name] = injectWrapper(rule);
  });
}

export default dataLineInjector;
