import mdContainer from 'markdown-it-container';

let markdownInstance = null;

const plugins = {
  spoiler: {
    validate(params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<details><summary>${markdownInstance.utils.escapeHtml(m[1])}</summary>\n`;
      } else {
        // closing tag
        return '</details>\n';
      }
    }
  },
  classname: {
    validate: name => name.trim().length,
    render: (tokens, idx, options, env, slf) => {
      if (tokens[idx].nesting === 1) {
        const className = tokens[idx].info.trim();
        tokens[idx].attrJoin('class', className);
        tokens[idx.tag] = 'div';
        return `<div class="${className}">\n`;
      } else {
        return '</div>\n';
      }
    }
  }
};

const arrayFuncs = ['spoiler', 'classname'];

function mdContainerWrapper(md, options) {
  markdownInstance = md;
  arrayFuncs.forEach((pluginName) => {
    if (plugins[pluginName] != null) {
      md.use(mdContainer, pluginName, plugins[pluginName]);
    }
  });
}

export default mdContainerWrapper;
