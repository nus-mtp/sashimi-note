import elementUtils from 'src/helpers/elementUtils';
import documentBuilder from 'src/helpers/documentBuilder';
import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';


function hasClass(element, selector) {
  const className = ` ${selector} `;
  if ((` ${element.className} `).replace(/[\n\t\r]/g, ' ').indexOf(className) > -1) {
    return true;
  }
  return false;
}

const DIR_UP = 1;
const DIR_DOWN = -1;

function invertDirection(direction) {
  return (direction === DIR_UP) ? DIR_DOWN : DIR_UP;
}

function searchFrom(frameDoc, direction) {
  const x = frameDoc.defaultView.innerWidth/2;
  const yLimit = frameDoc.defaultView.innerHeight;
  const interval = 10;

  for (let i = 0; i < interval; i += 1) {
    const searchX = x;
    const directionMultiplier = (direction === DIR_UP) ? i : (interval - i - 1);
    const searchY = (yLimit / interval) * directionMultiplier;

    const theElement = frameDoc.elementFromPoint(searchX, searchY);

    if (theElement) {
      const endNode = frameDoc.body;

      let searchNode = theElement;
      let foundNode = null;
      do {
        if (hasClass(searchNode, 'page-view')) {
          foundNode = searchNode;
          return foundNode;
        }
        searchNode = searchNode.parentNode;
      } while (searchNode !== endNode && searchNode != null);
    }
  }
  return null;
}

function getFutureSlide(pastSlide, direction) {
  return (direction === DIR_UP) ? pastSlide.previousSibling : pastSlide.nextSibling;
}

function moveSlide(frameDoc, direction) {
  const pastSlide = searchFrom(frameDoc, invertDirection(direction));
  const futureSlide = getFutureSlide(pastSlide, direction);
  if (futureSlide) {
    const rect = futureSlide.getBoundingClientRect();
    const windowObj = futureSlide.ownerDocument.defaultView;
    const marginTop = domUtils.getComputedStyle(futureSlide).marginTop;
    const marginTopPx = unitConverter.get(marginTop, 'px', false) || 0;

    windowObj.scrollTo(0, (frameDoc.body.scrollTop + rect.top) - marginTopPx);
  }
}

const keyEventListener = function keyEventListener(event) {
  const frameDoc = documentBuilder.getDocument(this.elementRef);
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'PageUp':
      event.preventDefault();
      moveSlide(frameDoc, DIR_UP);
      break;
    case 'ArrowDown':
    case 'ArrowRight':
    case 'PageDown':
      event.preventDefault();
      moveSlide(frameDoc, DIR_DOWN);
      break;
    default: break;
  }
};

const SlidesNavigator = function SlidesNavigator(elementRef) {
  this.elementRef = elementUtils.resolveElement(elementRef);

  this.keyEventListener = keyEventListener.bind(this);

  this.setDomBehaviour();
};

SlidesNavigator.prototype.unsetDomBehaviour = function unsetDomBehaviour() {
  this.elementRef.removeEventListener('keydown', this.keyEventListener);
};

SlidesNavigator.prototype.setDomBehaviour = function setDomBehaviour() {
  // Clear all previously added event listener;
  this.unsetDomBehaviour();
  this.elementRef.addEventListener('keydown', this.keyEventListener);
};

export default SlidesNavigator;
