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

  /**
   * Add one style to the given iframe
   * @param {Element} iframeElement
   * @param {string} url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   */
  addStyle(iframeElement, style) {
    return new Promise((resolve, reject) => {
      const frameDoc = this.getDocument(iframeElement);
      const styleElement = constructStyleLink(frameDoc, style);
      frameDoc.head.appendChild(styleElement);

      // Resolve only when the style has been loaded.
      // https://www.phpied.com/when-is-a-stylesheet-really-loaded/
      // This doesn't work well with Firefox and IE. This will result in
      //   the initial rendering of css to not work correctly.
      //   However, subsequent rendering should work normally.
      // Temporary solution:
      //   All CSS will get loaded in 10ms, a polling of 50ms setInterval
      //   is sufficient to ensure all css get loaded and rendered.
      // TODO: Implement a better solution for this problem
      const poller = setInterval(() => {
        const styleSheets = frameDoc.styleSheets;
        for (let i = 0; i < styleSheets.length; i += 1) {
          const stylesheet = styleSheets[i];

          // A trival way to check if the intended css has been loaded.
          // This method check for substring only, so stylesheet with similar
          //   name will not work.
          if (stylesheet.href.includes(style)) {
            resolve();
            clearInterval(poller);
          }
        }
      }, 50);
    });
  },

  /**
   * Add multiple styles to the given iframe
   * @param {Element} iframeElement
   * @param {Array<string>} An array of url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   */
  addStyles(iframeElement, styles) {
    return Promise.all(styles.map(style =>
      this.addStyle(iframeElement, style)
    ));
  },
};
