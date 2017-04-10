import domUtils from 'src/helpers/domUtils';
import unitConverter from 'src/helpers/unitConverter';

const NOT_IMPLEMENTED = null;

const guard = {
  translateY(translateY, parentEle) {
    const bottomLimit = (() => {
      const numberOfElement = parentEle.childNodes.length;
      const pageHeight = unitConverter.get(parentEle.childNodes[0].style.height, 'px', false);
      const pageMargin = unitConverter.get(getComputedStyle(parentEle.childNodes[0]).marginTop, 'px', false);
      return -(numberOfElement) * (pageHeight + pageMargin);
    })();
    if (translateY < bottomLimit) translateY = bottomLimit;
    if (translateY > 0) translateY = 0;
    return translateY;
  },
  translateX(translateX, parentEle) {
    const sideLimit = (() => {
      const pageWidth = unitConverter.get(parentEle.childNodes[0].style.width, 'px', false);
      return (pageWidth / 2);
    })();
    if (translateX < -sideLimit) translateX = -sideLimit;
    if (translateX > sideLimit) translateX = sideLimit;
    return translateX;
  },
  scale(scale) {
    if (scale < 0.05) scale = 0.05;
    if (scale > 15) scale = 15;
    return scale;
  }
};

const putDocumentBackToPlace = function putDocumentBackToPlace(navInstance) {
  if (!navInstance.el.container.documentNavigator) {
    return;
  }

  const tempContainerHeight = navInstance.el.container.documentNavigator.originalStyle.height;
  const tempContainerWidth = navInstance.el.container.documentNavigator.originalStyle.width;

  const renderHeight = tempContainerHeight * navInstance.transform.scale;
  const renderWidth = tempContainerWidth * navInstance.transform.scale;

  // Readjust scrollTop - [1] Cache original height of parent div
  let oriHeight = domUtils.getComputedStyle(navInstance.el.parent).height;
  if (oriHeight === 'auto') oriHeight = `${navInstance.el.parent.scrollHeight}px`;
  const oriHeightPx = unitConverter.get(oriHeight, 'px', false);

  // Readjust parent height and width to fix overall scrollbar problem
  navInstance.el.parent.style.height = `${renderHeight}px`;
  navInstance.el.parent.style.width = `${renderWidth}px`;

  // Readjust scrollTop - [2] Compute height difference and adjust scrollTop
  const newHeightPx = renderHeight;
  const heightChange = newHeightPx / oriHeightPx;
  navInstance.el.parent.parentNode.scrollTop *= heightChange;
};

export default function(navInstance) {
  // Event handlers
  this.eventFn = {
    gesture: {
      dragstart(event) {
        if (navInstance.eventInstance.state.pointerType === 'touch') {
          navInstance.eventInstance.state.action = 'panning';
          return false;
        } else {
          // other input: Mouse, Pen will not change
          //   the eventInstance.state.action
          return true;
        }
      },
      dragmove(event) {
        if (navInstance.eventInstance.state.action !== 'panning') {
          return;
        }

        // translate the element
        const translateY = (navInstance.el.parent.scrollTop - (event.dy));
        navInstance.el.parent.scrollTop = translateY;
      },
      dragend(event) {
        if (navInstance.eventInstance.state.action === 'panning') {
          navInstance.eventInstance.state.action = null;
        }
      },
      zoom(event) {
        event.preventDefault();
        if (event.type === 'gesturemove' && navInstance.eventInstance.numPointers < 2) {
          // The event is a gesture, but is it not executed by at least two fingers
          return;
        }
        if (!event.ds) {
          // event polyfill for interactjs gesturable
          // deltaY is only available for mousewheel event
          // detail is only available for DOMMouseWheel event
          event.ds = (event.deltaY) ? (-event.deltaY / 1000) : (-event.detail / 30);
        }

        let scale = navInstance.transform.scale * (1 + event.ds) || navInstance.transform.scale;
        scale = guard.scale(scale);
        navInstance.transform.set({ scale });

        putDocumentBackToPlace(navInstance);
      },
    },
    pointer: {
      down: (event) => {
        // Set the state of event instance
        navInstance.eventInstance.pointers[event.pointerId] = event;
        navInstance.eventInstance.state.pointerType = event.pointerType || 'mouse';
        navInstance.eventInstance.numPointers = Object.keys(navInstance.eventInstance.pointers).length;

        if (navInstance.eventInstance.state.pointerType === 'touch') {
          navInstance.interactable.draggable(this.settings.draggable);
        } else {
          navInstance.interactable.draggable(false);
        }
      },
      up(event) {
        // Set the state of event instance
        delete navInstance.eventInstance.pointers[event.pointerId];
        navInstance.eventInstance.state.pointerType = null;
        navInstance.eventInstance.numPointers = Object.keys(navInstance.eventInstance.pointers).length;
      },
      move: NOT_IMPLEMENTED,
    },
    dom: {
      resize(event) {
        // Retrieve the resized width
        const marginWidth = 60;
        const transitionDuration = 500;
        // Resize the element's transformer
        navInstance.el.container.style.transition = `transform ${transitionDuration}ms`;
        navInstance.width.element = navInstance.width.element || navInstance.width.html - marginWidth;
        navInstance.transform.set({ scale: (navInstance.width.html - marginWidth) / navInstance.width.element });
        setTimeout(() => {
          navInstance.el.container.style.transition = '';
        }, transitionDuration);

        putDocumentBackToPlace(navInstance);
      },
      transitioned: NOT_IMPLEMENTED
    },
    mousewheel: (event) => {
      if (event.ctrlKey) {
        // event.preventDefault() is called so that MS Edge does not
        // zoom the entire window.
        event.preventDefault();
        this.eventFn.gesture.zoom.call(navInstance, event);
      }
    }
  };

  this.settings = {
    draggable: {
      inertia: {
        resistance: 5,
        minSpeed: 400,
        endSpeed: 20
      },
      onstart: this.eventFn.gesture.dragstart,
      onmove: this.eventFn.gesture.dragmove,
      onend: this.eventFn.gesture.dragend,
    },
    gesturable: {
      onmove: this.eventFn.gesture.zoom,
    }
  };
}
