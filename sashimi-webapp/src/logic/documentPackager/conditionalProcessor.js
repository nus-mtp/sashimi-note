/**
 * Conditional processor to format what to show and what to hide in viewer
 * Referenced from markdown-it-inline-comments plugin
 * See here: https://github.com/jay-hodgson/markdown-it-inline-comments
 * Process =>hide 'This is a Text' <= as '' and ==>hide:condition 'Text in here' <== as ''
 * based on the stated condition. (E.g. if condition = all, it hides from all versions.
 * If condition = student, it hides from student versions only.)
 * @param {MarkdownIt} md - MarkdownIt object containing parsed data of markdown content
 */
let fileName = null;

function findName(state, startLine) {
  const indent = state.sCount[startLine];
  const end = state.eMarks[startLine];
  const text = state.getLines(startLine, startLine + 1, indent, true).toString();

  if (end >= 9) {
    const parameter = text.slice(0, 9);
    if (parameter === 'fileName:') {
      fileName = text.slice(9, end);
    }
  }
}

function hideShowInline(state, silent) {
  const max = state.posMax;
  const start = state.pos;
  let found;

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

  const content = state.src.slice(start + 6, state.pos);

  // don't allow unescaped newlines inside
  if (content.match(/(^|[^\\])(\\\\)*[\n]/)) {
    state.pos = start;
    return false;
  }
  return true;
}

/**
 * Referenced from markdown-it's fence rule and markdown-it-container plugin
 * See here: https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/fence.js
 * For conditional categorical hiding.
 * Outputs everything that is conditionally stated to be hidden as ''
 */
function hideShowBlock(state, startLine, endLine, silent) {
  let nextLine; // next line counter, to keep track of line number
  let token;  // token for use to pass into renderer to generate HTML
  let category = null; // variable to store conditional hiding for different document types
  let hasCategory = false;
  let haveEndMarker = false;
  let pos = state.bMarks[startLine] + state.tShift[startLine]; // current "cursor" position
  let max = state.eMarks[startLine]; // position of last char in the line

  if (pos + 7 > max) { return false; }

  findName(state, startLine);

  // Check out the first character quickly,
  // this should filter out most of non-containers
  if (state.src.charCodeAt(pos) !== 61 /* = */) { return false; }

  if (state.src.charCodeAt(pos + 1) !== 61  /* = */||
      state.src.charCodeAt(pos + 2) !== 62 /* > */ ||
      state.src.charCodeAt(pos + 3) !== 104 /* h */ ||
      state.src.charCodeAt(pos + 4) !== 105 /* i */ ||
      state.src.charCodeAt(pos + 5) !== 100 /* d */ ||
      state.src.charCodeAt(pos + 6) !== 101 /* e */
      ) {
    return false;
  }

  // Check if got category e.g. ==>hide:slides ...
  if (state.src.charCodeAt(pos + 7) === 58  /* : */) {
    hasCategory = true;
    category = state.src.slice(pos+8, max).toString();
  }

  const oldPos = pos;
  pos = state.skipChars(pos, state.src.charCodeAt(pos + 6));

  const markup = state.src.slice(oldPos, pos);
  const params = state.src.slice(pos, max);

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  if (!hasCategory || category === fileName) {
    for (;;) {
      nextLine += 1;
      if (nextLine >= endLine) {
        // unclosed block should be leave the ==>hide there
        // checks if nextLine is a valid value too
        return false;
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      // This checks if there was an unclosed hide block
      // before the start of another hide block
      // e.g. ==>hide *Text here* \n\n ==>hide ... <==
      if (state.src.charCodeAt(pos) === 61  /* = */&&
      state.src.charCodeAt(pos + 1) === 61  /* = */&&
      state.src.charCodeAt(pos + 2) === 62 /* > */ &&
      state.src.charCodeAt(pos + 3) === 104 /* h */ &&
      state.src.charCodeAt(pos + 4) === 105 /* i */ &&
      state.src.charCodeAt(pos + 5) === 100 /* d */ &&
      state.src.charCodeAt(pos + 6) === 101 /* e */
      ) {
        return false;
      }

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
          // non-empty line with negative indent should stop the list:
          // - <==
          //  test
        break;
      }

      const marker = state.src.charCodeAt(pos);
      const marker2 = state.src.charCodeAt(pos + 1);
      const marker3 = state.src.charCodeAt(pos + 2);

      if (marker === 0x3C /* < */ && marker2 === 0x3D /* = */ &&
          marker3 === 0x3D /* = */
      ) {
        pos = state.skipChars(pos, marker3);

        // make sure tail has spaces only
        pos = state.skipSpaces(pos);

        if (pos >= max) { break; }

        // found!
        haveEndMarker = true;
        break;
      }
    }
  } else if (category !== fileName) {
    // Having found the start hide syntax (e.g. ==>hide:notequal), find the
    // end marker (e.g. <==) and remove them from output into viewer, since
    // the content will not be hidden
    const contentStartLine = nextLine + 1;
    let oldLineMax;

    for (;;) {
      nextLine += 1;
      if (nextLine >= endLine) {
        // unclosed block should be leave the ==>hide there
        // checks if nextLine is a valid value too
        return false;
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      const marker = state.src.charCodeAt(pos);
      const marker2 = state.src.charCodeAt(pos + 1);
      const marker3 = state.src.charCodeAt(pos + 2);

      if (marker === 0x3C /* < */ && marker2 === 0x3D /* = */ &&
          marker3 === 0x3D /* = */
      ) {
        // tokenize the content and ignore the hide syntax
        oldLineMax = state.lineMax;

        // this will prevent lazy continuations from ever going past our end marker
        state.lineMax = nextLine;

        token = state;
        token.markup = markup;
        token.block = true;
        token.info = params;
        token.map = [contentStartLine, nextLine];

        state.md.block.tokenize(state, contentStartLine, nextLine);

        token = state;
        token.block = true;

        state.lineMax = oldLineMax;
        state.line = nextLine + 1;
        return true;
      }
    }
  }

  // If a fence has heading spaces, they should be removed from its inner block
  const blockOffset = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token = state;
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, blockOffset, true);
  token.markup = markup;
  token.map = [startLine, state.line];

  return true;
}

export default {
  hideShowPlugin: function hideShowPlugin(md) {
    md.inline.ruler.after('emphasis', 'hideShowInline', hideShowInline);
    md.block.ruler.after('table', 'hideShowBlock', hideShowBlock);
  },
  setFileName: function setFileName(name) {
    fileName = name;
  },
  clearFileName: function clearFileName() {
    fileName = null;
  }
};
