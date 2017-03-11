const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

module.exports = {
  'navigate to /content': pagesModeActivation['should activate Pages mode'],

  'write to codemirror': (browser) => {
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/full-documents')], () => {
        browser
          .waitForElementPresent('.page-view:nth-child(24)', 5000, '24 pages are rendered');
      });
  },

  'check height of element': (browser) => {
    browser
      .execute(() => {
        const ACCEPTANCE_THRESHOLD_PX = 2;
        const pages = document.getElementsByClassName('page-view');
        const results = [];
        let processedElementCount = 0;

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
          const childrenNodes = pages[pageIndex].childNodes;

          for (let elementIndex = 0; elementIndex < childrenNodes.length; elementIndex += 1) {
            const element = childrenNodes[elementIndex];
            const eleStyle = getComputedStyle(element);
            const expectedHeight = element.pageRenderer.totalHeight;
            const actualHeight = parseFloat(eleStyle.height) +
                                 parseFloat(eleStyle.marginBottom) +
                                 parseFloat(eleStyle.marginTop);

            // Tolerate small difference in height
            if (Math.abs(actualHeight - expectedHeight) > ACCEPTANCE_THRESHOLD_PX) {
              results.push({ name: element.tagName, expectedHeight, actualHeight });
            }
            processedElementCount += 1;
          }
        }

        if (processedElementCount === 0) {
          throw new Error('No element is being processed');
        }

        return results;
      }, [], (results) => {
        const assertReport =
          (results.value.length === 0)
          ? 'All elements have consistent height'
          : results.value.map((result, index) => {
            return `\n ${index+1}. \t ${result.name} \t ${result.expectedHeight} \t ${result.actualHeight}`;
          });

        browser.assert.equal(results.value.length, 0, assertReport);
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
