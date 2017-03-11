const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

module.exports = {
  'should activate Pages mode': pagesModeActivation['should activate Pages mode'],

  'should render oversized content in the same page if it is the first item in the page': (browser) => {
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/oversized-content-at-beginning')], () => {
        browser
          .waitForElementPresent('.page-view:nth-child(3)', 5000, '3 pages are rendered')
          .waitForElementPresent('.page-view:nth-child(2) pre code', 5000, 'Code block is rendered in page 2');
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
