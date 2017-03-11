const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

module.exports = {
  'navigate to /content': pagesModeActivation['should activate Pages mode'],

  'write to codemirror': (browser) => {
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/oversized-content-at-middle')], () => {
        browser
          .waitForElementPresent('.page-view:nth-child(4)', 5000, '4 pages are rendered')
          .waitForElementPresent('.page-view:nth-child(3) pre code', 5000, 'Code block is rendered in page 3');
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
