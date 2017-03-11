const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

module.exports = {
  'should activate Pages mode': pagesModeActivation['should activate Pages mode'],

  'should push element subsequent to pagebreak to the next page': (browser) => {
    browser
      .execute(function(data) {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/pagebreak-between-elements')], function(codeMirrorInstance) {
        browser
          .waitForElementPresent('.page-view:nth-child(4)', 5000, '4 pages are rendered');
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
