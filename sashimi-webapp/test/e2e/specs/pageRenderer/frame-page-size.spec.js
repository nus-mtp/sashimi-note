const textLoader = require('../../helpers/textLoader');

module.exports = {
  'navigate to /content': (browser) => {
    const devServer = browser.globals.devServerURL;

    browser
      .url(`${devServer}/content`)
      .waitForElementVisible('#app', 5000);
  },

  'verify the HTML in /content': (browser) => {
    browser
      .assert.elementPresent('.viewer')
      .assert.elementPresent('#viewer-container')
      .assert.elementPresent('#manage-file');
  },

  'change fileFormat to Pages mode': (browser) => {
    browser
      .click('#manage-file')
      .pause(500)
      .click('button[data-format="pages"]')
      .pause(500)
      .assert.elementPresent('.viewer[data-fileformat="pages"]');
  },

  'check size of reference and renderer frame ': (browser) => {
    browser
      .getElementSize('#reference-frame-of-viewer-container', (referenceResult) => {
        browser
          .getElementSize('.page-view', (renderResult) => {
            const referenceSize = referenceResult.value;
            const renderSize = renderResult.value;
            browser.assert.equal(referenceSize.width, renderSize.width);
          });
      })
      .getCssProperty('#reference-frame-of-viewer-container', 'padding-top', (referenceResult) => {
        browser
          .getCssProperty('.page-view', 'padding', (renderResult) => {
            const referenceStyle = referenceResult.value;
            const renderStyle = renderResult.value;
            browser.assert.equal(referenceStyle, renderStyle);
          });
      })
      .getCssProperty('#reference-frame-of-viewer-container', 'padding-bottom', (referenceResult) => {
        browser
          .getCssProperty('.page-view', 'padding', (renderResult) => {
            const referenceStyle = referenceResult.value;
            const renderStyle = renderResult.value;
            browser.assert.equal(referenceStyle, renderStyle);
          });
      })
      .getCssProperty('#reference-frame-of-viewer-container', 'padding-left', (referenceResult) => {
        browser
          .getCssProperty('.page-view', 'padding', (renderResult) => {
            const referenceStyle = referenceResult.value;
            const renderStyle = renderResult.value;
            browser.assert.equal(referenceStyle, renderStyle);
          });
      })
      .getCssProperty('#reference-frame-of-viewer-container', 'padding-right', (referenceResult) => {
        browser
          .getCssProperty('.page-view', 'padding', (renderResult) => {
            const referenceStyle = referenceResult.value;
            const renderStyle = renderResult.value;
            browser.assert.equal(referenceStyle, renderStyle);
          });
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
