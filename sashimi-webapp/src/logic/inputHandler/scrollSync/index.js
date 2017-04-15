const targetClassName = 'code-line';
/**
 * Return an array of code lines element found inside a document object
 * @param {HTMLDocument} scrollDocument - default to window's document
 */
function getCodeLines(scrollDocument = document) {
  const codeLines = scrollDocument.getElementsByClassName(targetClassName);
  const codeLinesArray = [];
  for (let i = 0; i < codeLines.length; i += 1) {
    codeLinesArray[i] = codeLines[i];
  }
  return codeLinesArray;
}

function isElementWithinScrollPosition(scrollPosition) {
  return (element) => {
    const lineStart = parseInt(element.dataset.lineStart, 10);
    const lineEnd = parseInt(element.dataset.lineEnd, 10);
    return (lineStart <= scrollPosition && scrollPosition <= lineEnd);
  };
}

export default {
  getElementInScrollPosition(scrollPosition, scrollDocument = document) {
    return getCodeLines(scrollDocument).find(isElementWithinScrollPosition(scrollPosition));
  },
};
