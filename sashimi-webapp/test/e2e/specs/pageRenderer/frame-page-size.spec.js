const pagesModeActivation = require('./pages-mode-activation');

module.exports = {
  'navigate to /content': pagesModeActivation['should activate Pages mode'],

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
