const pagesModeActivation = require('./pages-mode-activation');

const CSS_SELECTOR_REFERENCE_FRAME = '#reference-frame-of-viewer-container';
const CSS_SELECTOR_RENDER_FRAME = '.page-view';

const compareCssProperty = (browser, propertyName) => {
  browser.getCssProperty(CSS_SELECTOR_RENDER_FRAME, propertyName, (renderResult) => {
    browser
      .expect.element(CSS_SELECTOR_REFERENCE_FRAME)
      .to.have.css(propertyName)
      .which.equal(renderResult.value);
  });
};

module.exports = {
  'should activate Pages mode': pagesModeActivation['should activate Pages mode'],

  'should have the same page size for reference and renderer frame ': (browser) => {
    compareCssProperty(browser, 'width');
    compareCssProperty(browser, 'padding-top');
    compareCssProperty(browser, 'padding-bottom');
    compareCssProperty(browser, 'padding-left');
    compareCssProperty(browser, 'padding-right');
  },

  'after': (browser) => {
    browser.end();
  },

};
