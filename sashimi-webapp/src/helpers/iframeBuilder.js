const basicHTML = `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
`;

function constructStyleLink(renderDoc, link) {
  const styling = renderDoc.createElement('link');
  const attributes = {
    type: 'text/css',
    rel: 'stylesheet',
    href: link
  };

  Object.keys(attributes).forEach((key) => {
    styling.setAttribute(key, attributes[key]);
  });
  return styling;
}

export default {
  getDocument(iframeElement) {
    return iframeElement.contentWindow.document;
  },

  /**
   * Rebuild the iframe document to have HTML5 standard.
   * @param {Element} iframe element
   * @return {Object} document object of the iframe
   */
  rebuild(iframeElement) {
    const iframeDoc = this.getDocument(iframeElement);
    iframeDoc.open();
    iframeDoc.write(basicHTML);
    iframeDoc.close();
    return iframeDoc;
  },

  addStyle(iframeElement, style) {
    const styleElement = constructStyleLink(iframeElement.contentWindow.document, style);
    this.getDocument(iframeElement).head.appendChild(styleElement);
  },

  addStyles(iframeElement, styles) {
    styles.forEach((style) => {
      this.addStyle(iframeElement, style);
    });
  }
};
