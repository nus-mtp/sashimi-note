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
  /**
   * Get the document object of a iframe element
   * @param {Element | Window} An iframe element or a window object
   * @return {Document} a document object the iframe element
   * @throws {Error} if the frameElement doesn't have a window object.
   */
  getDocument(frameElement) {
    let frameWindow = frameElement.contentWindow;

    // Check if frameElement is itself a window object
    if (frameElement.window === frameElement) {
      frameWindow = frameElement;
    }

    if (frameWindow == null) {
      throw new Error(`The parameter doesn't have a window object. Received parameter: ${frameWindow}`);
    }
    return frameWindow.document;
  },

  /**
   * Rebuild the iframe document to have HTML5 standard.
   * @param {Element | Window} An iframe element or a window object
   * @return {Object} document object of the iframe
   */
  rebuild(frameElement) {
    const iframeDoc = this.getDocument(frameElement);
    iframeDoc.open();
    iframeDoc.write(basicHTML);
    iframeDoc.close();
    return iframeDoc;
  },

  /**
   * Add one style to the given iframe
   * @param {Element | Window} An iframe element or a window object
   * @param {string} url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   */
  addStyle(frameElement, style) {
    return new Promise((resolve, reject) => {
      const frameDoc = this.getDocument(frameElement);
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
   * @param {Element | Window} An iframe element or a window object
   * @param {Array<string>} An array of url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   */
  addStyles(frameElement, styles) {
    return Promise.all(styles.map(style =>
      this.addStyle(frameElement, style)
    ));
  },
};
