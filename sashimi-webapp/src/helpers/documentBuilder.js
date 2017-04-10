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
   * @throws {Error} "Error loading style link..." if link failed to load or is empty.
   */
  addStyle(frameElement, styleUrl) {
    return new Promise((resolve, reject) => {
      const frameDoc = this.getDocument(frameElement);
      const styleElement = constructStyleLink(frameDoc, styleUrl);

      // Resolve only when the style has been loaded.
      // Monitoring is done before stylesheet got inserted.
      // https://www.phpied.com/when-is-a-stylesheet-really-loaded/
      if (styleElement.onload === null) { // onload is defined but not set
        // Solution for most modern browser.
        // 'onload' will be emitted by all major browser,
        //   IE/Edge, Webkit and Chrome > 2012, Firefox > 2014.
        styleElement.onload = () => {
          resolve();
        };
        styleElement.onerror = (event) => {
          reject(new Error(`Error loading style link: ${event.target.href}`));
        };
      } else {
        // Fall back solution for older browser before 2014
        // This solution only for for Chrome, Safari and Webkit browser
        const pollIncrement = 50;
        const poller = setInterval(() => {
          // If the iframe window doesn't exist, loading of style should be terminated.
          //   Since the content no longer exist. There is no need to load the style anymore.
          //   Therefore, no error should be thrown.
          if (!frameElement.contentWindow) {
            clearInterval(poller);
            return;
          }

          const styleSheets = frameElement.contentWindow.document.styleSheets;
          for (let i = 0; i < styleSheets.length; i += 1) {
            const stylesheet = styleSheets[i];

            // A trival way to check if the intended css has been loaded.
            // This method check for substring only, so stylesheet with similar
            //   name will not work.
            const hasParsedStyleSheet = stylesheet.href.includes(styleUrl);

            if (hasParsedStyleSheet) {
              clearInterval(poller);
              const styleRules = stylesheet.rule || stylesheet.cssRules;
              if (styleRules.length > 0) {
                resolve();
              } else {
                // CSS style is either empty or failed to load.
                reject(`Error loading style link: ${stylesheet.href}`);
              }
              return;
            }
          }
        }, pollIncrement);
      }

      // Insert style link into stylesheet
      frameDoc.head.appendChild(styleElement);
    });
  },

  /**
   * Add multiple styles to the given iframe
   * @param {Element | Window} An iframe element or a window object
   * @param {Array<string>} An array of url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   * @throws {Error} "Error loading style link..." if link failed to load or is empty.
   */
  addStyles(frameElement, stylesUrl) {
    return Promise.all(stylesUrl.map(styleUrl =>
      this.addStyle(frameElement, styleUrl)
    ));
  },
};
