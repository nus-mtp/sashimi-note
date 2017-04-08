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
   * @throws {Error} "Error loading style link..." if link failed to load or is empty.
   */
  addStyle(iframeElement, styleUrl) {
    return new Promise((resolve, reject) => {
      const styleElement = constructStyleLink(iframeElement.contentWindow.document, styleUrl);

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
          if (!iframeElement.contentWindow) {
            clearInterval(poller);
            return;
          }

          const styleSheets = iframeElement.contentWindow.document.styleSheets;
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
      this.getDocument(iframeElement).head.appendChild(styleElement);
    });
  },

  /**
   * Add multiple styles to the given iframe
   * @param {Element} iframeElement
   * @param {Array<string>} An array of url string pointing to a stylesSheet
   * @return {Promise} return a promise when all the styles has been loaded
   * @throws {Error} "Error loading style link..." if link failed to load or is empty.
   */
  addStyles(iframeElement, stylesUrl) {
    return Promise.all(stylesUrl.map(styleUrl =>
      this.addStyle(iframeElement, styleUrl)
    ));
  },
};
