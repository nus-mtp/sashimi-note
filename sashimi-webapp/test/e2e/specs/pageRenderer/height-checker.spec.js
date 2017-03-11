const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');
const expect = require('chai').expect;

describe('Height checker', () => {
  it('should contain elements of the same heights in both reference and render frame', (browser) => {
    pagesModeActivation(browser);
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/full-documents')], () => {
        browser.expect.element('.page-view:nth-child(24)').to.be.present.before(5000);
      });
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
        try {
          expect(results.value.length).to.equal(0);
        } catch (error) {
          const errorReport = results.value.map((result, index) => {
            return `\n ${index+1}. \t ${result.name} \t ${result.expectedHeight} \t ${result.actualHeight}`;
          });
          browser.assert.fail('some inconsistency', 'All element heights to be consistent', errorReport);
        }
      });
  });

  afterEach((browser, done) => {
    browser.end(() => done());
  });
});
