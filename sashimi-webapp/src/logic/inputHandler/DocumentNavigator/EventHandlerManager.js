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
          return false;
        }

        if (navInstance.eventInstance.numPointers > 1) {
          return false; // Panning is restricted with using 1 finger only
        }
        const moveSpeed = (1/navInstance.transform.scale);
        const translateY = guard.translateY(navInstance.transform.translateY + (event.dy * moveSpeed), navInstance.el.container);
        let translateX = 0;
        if ((navInstance.width.parent) < navInstance.width.element * navInstance.transform.scale) {
          translateX = guard.translateX(navInstance.transform.translateX + (event.dx * moveSpeed), navInstance.el.container);
        }

        // translate the element
        navInstance.transform.set({ translateX, translateY });
        return false;
      },
      dragend(event) {
        if (navInstance.eventInstance.state.action === 'panning') {
          navInstance.eventInstance.state.action = null;
        }
      },
      zoom(event) {
        if (event.type === 'gesturemove' && navInstance.eventInstance.numPointers !== 2) {
        // The event is a gesture, but is it not executed by two fingers
          return;
        }

        if (!event.ds) event.ds = (-event.deltaY / 1000);
        let scale = navInstance.transform.scale * (1 + event.ds);
        scale = guard.scale(scale);
        navInstance.transform.set({ scale });
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
        navInstance.transform.set({ scale: (navInstance.width.parent - marginWidth) / navInstance.width.element });
        setTimeout(() => {
          navInstance.el.container.style.transition = '';
        }, transitionDuration);
      },
      transitioned: NOT_IMPLEMENTED
    },
    mousewheel: (event) => {
      if (event.ctrlKey) {
        // event.preventDefault() is called so that MS Edge does not
        // zoom the entire window.
        event.preventDefault();

        this.eventFn.gesture.zoom.call(navInstance, event);
      } else {
        let translateY = navInstance.transform.translateY - ((event.deltaY/4) * (1 / navInstance.transform.scale));
        translateY = guard.translateY(translateY, navInstance.el.container);
        navInstance.transform.set({ translateY });
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
