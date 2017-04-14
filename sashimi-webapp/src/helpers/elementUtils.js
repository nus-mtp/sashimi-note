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
  }
};
