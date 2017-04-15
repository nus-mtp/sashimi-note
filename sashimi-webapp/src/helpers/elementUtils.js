export default {
  /**
   * A standardise way to obtain an element reference by using an element Id or the object itself.
   * @param {string | Element | Window} targetReference - Receive either a string Id, an element
   *                                                      or window reference.
   * @param {Document} [altDocument=Document] - Document object that is used to resolve
   *                                            the Element reference. Default to window.document.
   * @return {Element} resolvedElement - return an element if it is found, otherwise, return null.
   */
  resolveElement(targetReference, altDocument) {
    if (typeof targetReference === 'string') {
      const doc = altDocument || document;
      return doc.getElementById(targetReference);
    } else if (targetReference.window === targetReference) {
      // targetReference is a window object
      return targetReference;
    } else {
      const doc = targetReference.ownerDocument;
      const windowObject = doc.defaultView || doc.parentWindow;

      if (targetReference instanceof windowObject.HTMLElement) {
        return targetReference;
      } else {
        return null;
      }
    }
  },

  getDocument(elementReference) {
    return elementReference.ownerDocument;
  },

  getWindow(elementReference) {
    if (elementReference.contentWindow) {
      return elementReference.contentWindow;
    }

    const doc = this.getDocument(elementReference);
    return doc.defaultView || doc.parentWindow;
  },

  /**
   * @param {(number|HTMLElement)} destination - Destination to scroll to (DOM element or number)
   * @param {number} duration - Duration of scrolling animation
   * @param {function} callback - Optional callback invoked after animation
   * @author Pawel Grzybek
   */
  scrollTo(destination, duration = 200, callback) {
    // Handle case where this code is used in an iframe element
    let viewerDoc = this.getDocument(destination);
    let viewWindow = this.getWindow(destination);
    if (typeof destination === 'number') {
      viewerDoc = document;
      viewWindow = window;
    }

    // Store initial position of a window and time
    // If performance is not available in your browser
    // It will fallback to new Date().getTime() - thanks IE < 10
    const start = viewWindow.pageYOffset;
    const startTime = ('now' in viewWindow.performance) ? performance.now() : new Date().getTime();

    // Take height of window and document to resolve max scrollable value
    // Prevent requestAnimationFrame() from scrolling below maximum scollable value
    // Resolve destination type (node or number)
    const documentHeight = Math.max(viewerDoc.body.scrollHeight,
                                    viewerDoc.body.offsetHeight,
                                    viewerDoc.documentElement.clientHeight,
                                    viewerDoc.documentElement.scrollHeight,
                                    viewerDoc.documentElement.offsetHeight);
    const windowHeight = viewWindow.innerHeight ||
                         viewerDoc.documentElement.clientHeight ||
                         viewerDoc.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round((documentHeight - destinationOffset) < windowHeight
                                                  ? documentHeight - windowHeight
                                                  : destinationOffset
                                                );

    // If requestAnimationFrame is not supported
    // Move window to destination position and trigger callback function
    if ('requestAnimationFrame' in viewWindow === false) {
      viewWindow.scroll(0, destinationOffsetToScroll);
      if (callback) { callback(); }
      return;
    }

    // function resolves position of a window and moves to exact amount of pixels
    // Resolved by calculating delta and timing function choosen by user
    function scroll() {
      const now = 'now' in viewWindow.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = time;
      viewWindow.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      // Stop requesting animation when window reached its destination
      // And run a callback function
      if (viewWindow.pageYOffset === destinationOffsetToScroll) {
        if (callback) { callback(); }
        return;
      }

      // If window still needs to scroll to reach destination
      // Request another scroll invokation
      requestAnimationFrame(scroll);
    }

    // Invoke scroll and sequential requestAnimationFrame
    scroll();
  },
};
