/**
 * Code were taken from https://github.com/quertt/markdown-it-asciimath
 * and modified for use with webpack, since the original npm package
 * wasn't meant for use with webpack.
 * Credits to: quertt for the wonderful library
 */

import katex from 'katex';
import asciiMathTexImg from './ASCIIMathTeXImg';

function trim(string) {
  return string.replace(/^\s+|\s+$/g, '');
}

function renderElement(str, disp) {
  return katex.renderToString(str, { displayMode: disp });
}

function preprocessMath(str) {
  let newstr;

  // correct index-texts
  newstr = str.replace(/_(.*?)(\s|$|=|\(|\)|\*|\/|\^)/g, '_($1)$2');

  // parse to TeX
  newstr = asciiMathTexImg.AMTparseAMtoTeX(newstr);

  return newstr;
}

function render(str, disp) {
  // split content
  const arr = trim(str).split('\n');
  let result = '';

  // render each line, skipping empty lines
  for (let i = 0; i < arr.length; i+=1) {
    if (arr[i]) {
      result += `<p>${renderElement(preprocessMath(arr[i]), disp)}<p>`;
    }
  }

  return result;
}

function renderInline(str, disp) {
  return renderElement(preprocessMath(str), disp);
}

function setup(md, options) {
  const defaultFenceRender = md.renderer.rules.fence;
  const defaultInlineRender = md.renderer.rules.code_inline;

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];

    if (token.info === 'math') {
      return render(token.content, true);
    }

    // pass token to default renderer.
    return defaultFenceRender(tokens, idx, opts, env, self);
  };

  md.renderer.rules.code_inline = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];

    if (token.content.substr(0, 4) === 'math') {
      return renderInline(trim(token.content.substr(4)), false);
    }

    return defaultInlineRender(tokens, idx, opts, env, self);
  };
}

export default setup;
