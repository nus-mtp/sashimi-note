/* Conditional processor to format what to show and what to hide in viewer
** Referenced from markdown-it-inline-comments plugin
** See here: https://github.com/jay-hodgson/markdown-it-inline-comments
** Process =>hide 'This is a Text' <= as ''
*/

function hideShowInline(state, silent) {
  let found;
  let content;
  const max = state.posMax;
  const start = state.pos;

  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 8 >= max) { return false; }

  if (state.src.charCodeAt(start) !== 61 /* = */ ||
      state.src.charCodeAt(start + 1) !== 62 /* > */ ||
      state.src.charCodeAt(start + 2) !== 104 /* h */ ||
      state.src.charCodeAt(start + 3) !== 105 /* i */ ||
      state.src.charCodeAt(start + 4) !== 100 /* d */ ||
      state.src.charCodeAt(start + 5) !== 101 /* e */
      ) {
    return false;
  }
  state.pos = start + 6;

  // check for end in same line
  while (state.pos + 2 <= max) {
    if (state.src.charCodeAt(state.pos) === 60 /* < */ &&
        state.src.charCodeAt(state.pos + 1) === 61 /* = */
    ) {
      found = true;
      state.pos += 2;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 6, state.pos);

  // don't allow unescaped newlines inside
  if (content.match(/(^|[^\\])(\\\\)*[\n]/)) {
    state.pos = start;
    return false;
  }
  return true;
}

/*
** Referenced from markdown-it's fence rule
** See here: https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/fence.js
** Outputs everything within ==>hide and <== as ''
*/

function hideShowBlock(state, startLine, endLine, silent) {
  let marker;
  let len;
  let params;
  let nextLine;
  let mem;
  let token;
  let markup;
  let haveEndMarker = false;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];

  if (pos + 7 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  // Check out the first character quickly,
  // this should filter out most of non-containers
  if (marker !== 61 /* = */) { return false; }

  if (state.src.charCodeAt(pos + 1) !== 61  /* = */||
      state.src.charCodeAt(pos + 2) !== 62 /* > */ ||
      state.src.charCodeAt(pos + 3) !== 104 /* h */ ||
      state.src.charCodeAt(pos + 4) !== 105 /* i */ ||
      state.src.charCodeAt(pos + 5) !== 100 /* d */ ||
      state.src.charCodeAt(pos + 6) !== 101 /* e */
      ) {
    return false;
  }

  markup = state.src.slice(pos, pos + 7);
  params = state.src.slice(pos + 7, max);

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine += 1;
    if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
      break;
    }

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - <==
        //  test
      break;
    }

    marker = state.src.charCodeAt(pos);
    const marker2 = state.src.charCodeAt(pos + 1);
    const marker3 = state.src.charCodeAt(pos + 2);

    if (marker === 0x3C /* < */ && marker2 === 0x3D /* = */ &&
        marker3 === 0x3D /* = */
    ) {
      pos += 3;

      // make sure tail has spaces only
      pos = state.skipSpaces(pos);

      if (pos < max) { break; }

      // found!
      haveEndMarker = true;
      break;
    }
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);
  token = state;
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];

  return true;
}

export default function hideShowPlugin(md) {
  md.inline.ruler.after('emphasis', 'hideShowInline', hideShowInline);
  md.block.ruler.after('fence', 'hideShowBlock', hideShowBlock);
}
