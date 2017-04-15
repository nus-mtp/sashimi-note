import domUtils from 'src/helpers/domUtils';
import elementUtils from 'src/helpers/elementUtils';

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

const scrollSync = {
  getElementInScrollPosition(scrollPosition, scrollDocument = document) {
    return getCodeLines(scrollDocument).find(isElementWithinScrollPosition(scrollPosition));
  },

  getScrollPositionByDocument(scrollDocument = document) {
    const element = searchElement(scrollDocument);
    return (element) ? getLines(element).lineStart : null;
  },

  vueHelper: {
    scrollDoc: null,
    broadcastNewScrollPosition: function broadcastNewScrollPosition(event) {
      const newLinePosition = scrollSync.getScrollPositionByDocument(scrollSync.vueHelper.scrollDoc);
      if (newLinePosition != null) { this.$emit('updateEditorScrollPosition', newLinePosition); }
    },
    updateScrollPosition: function updateScrollPosition(position) {
      const elementToScroll = scrollSync.getElementInScrollPosition(position, scrollSync.vueHelper.scrollDoc);
      if (elementToScroll) { elementUtils.scrollTo(elementToScroll, 400); }
    },
    setDomBehaviour: function setDomBehaviour(scrollPositionWatcher, scrollDoc = document) {
      const scrollWindow = elementUtils.getWindow(scrollDoc);
      scrollSync.vueHelper.scrollDoc = elementUtils.getDocument(scrollDoc);
      scrollWindow.addEventListener('scroll', scrollSync.vueHelper.broadcastNewScrollPosition.bind(this));
      this.$watch(scrollPositionWatcher, scrollSync.vueHelper.updateScrollPosition.bind(this));
    },
    unsetDomBehaviour: function unsetDomBehaviour(scrollPositionWatcher, scrollDoc = document) {
      const scrollWindow = elementUtils.getWindow(scrollDoc);
      scrollWindow.removeEventListener('scroll', scrollSync.vueHelper.broadcastNewScrollPosition);
      this.$watch(scrollPositionWatcher, null);
      scrollSync.vueHelper.scrollDoc = null;
    }
  }
};

export default scrollSync;
