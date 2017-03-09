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
              results.push({ element, expectedHeight, actualHeight });
            }
            processedElementCount += 1;
          }
        }

        if (processedElementCount === 0) {
          throw new Error('No element is being processed');
        }

        return results;
      }, [], (results) => {
        browser.assert.equal(results.value.length, 0,
          (results.value.length === 0) ? 'All elements have consistent height' : results.value);
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
