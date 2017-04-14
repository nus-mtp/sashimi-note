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

  scrollTo(destinationElement, duration = 200, easing = 'linear', callback) {
    const easings = {
      linear(t) {
        return t;
      }
    };
    const viewerDoc = this.getDocument(destinationElement);
    const viewWindow = this.getWindow(destinationElement);

    const start = viewWindow.pageYOffset;
    const startTime = 'now' in viewWindow.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(viewerDoc.body.scrollHeight, viewerDoc.body.offsetHeight, viewerDoc.documentElement.clientHeight, viewerDoc.documentElement.scrollHeight, viewerDoc.documentElement.offsetHeight);
    const windowHeight = viewWindow.innerHeight || viewerDoc.documentElement.clientHeight || viewerDoc.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destinationElement === 'number' ? destinationElement : destinationElement.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in viewWindow === false) {
      scrollTo(destinationOffsetToScroll);
      // viewWindow.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }

    function scroll() {
      const now = 'now' in viewWindow.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      viewWindow.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      if (viewWindow.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }

      requestAnimationFrame(scroll);
    }

    scroll();
  }
};
