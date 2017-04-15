import domUtils from 'src/helpers/domUtils';

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

function getLines(element) {
  return {
    lineStart: parseInt(element.dataset.lineStart, 10),
    lineEnd: parseInt(element.dataset.lineEnd, 10)
  };
}

function isWithinLines(lineInfo, scrollPosition) {
  return (lineInfo.lineStart <= scrollPosition && scrollPosition <= lineInfo.lineEnd);
}

/**
 * Return a function for checking if an elemnet is within the specified scrollPosition
 * @param {number} scrollPosition
 * @return {function}
 */
function isElementWithinScrollPosition(scrollPosition) {
  return element => isWithinLines(getLines(element), scrollPosition);
}

function searchElement(scrollDocument = document) {
  const x = scrollDocument.defaultView.innerWidth/2;
  const yLimit = (scrollDocument.defaultView.innerHeight * 0.25); // Search only the top 25% of the window
  const offsetTop = 50;
  for (let i = offsetTop; i < yLimit + offsetTop; i += 1) {
    const searchX = x;
    const searchY = i;

    const theElement = scrollDocument.elementFromPoint(searchX, searchY);

    if (theElement) {
      const endNode = scrollDocument.body;

      let searchNode = theElement;
      let foundNode = null;
      do {
        if (domUtils.hasClass(searchNode, targetClassName)) {
          foundNode = searchNode;
          return foundNode;
        }
        searchNode = searchNode.parentNode;
      } while (searchNode !== endNode && searchNode != null);
    }
  }
  return null;
}

export default {
  getElementInScrollPosition(scrollPosition, scrollDocument = document) {
    return getCodeLines(scrollDocument).find(isElementWithinScrollPosition(scrollPosition));
  },

  getScrollPositionByDocument(scrollDocument = document) {
    const element = searchElement(scrollDocument);
    return (element) ? getLines(element).lineStart : null;
  }
};

