const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');
const codeMirrorTextInsert = require('../../helpers/codeMirrorTextInsert');

const expect = require('chai').expect;

describe('Height checker', () => {
  it('should contain elements of the same heights in both reference and render frame', (browser) => {
    pagesModeActivation(browser);
    codeMirrorTextInsert(browser, textLoader.load('references/full-documents'));

    // The document given contain 24 pages of element for a A4 page size.
    // It should be sufficient for checking most of the markdown elements.
    // TODO: Add katex into the document.

    browser
      .execute(() => {
        // We loosen the check requirement by accepted a deviation of +- 2px;
        // However, most of the time the test seems to give identical heights
        // making the threshold somewhat useless. We will keep it like this for now.
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
              // If the height difference is more than the specified threshold, we will
              // record it by pushing relevant information about the element into the result
              // array.
              results.push({ name: element.tagName, expectedHeight, actualHeight });
            }
            processedElementCount += 1;
          }
        }

        if (processedElementCount === 0) {
          // If this is true, it most likely imply that no content is being
          // processed, thus we cannot know if the algorithm run correctly or not.
          throw new Error('No element is being processed');
        }

        return results;
      }, [], (results) => {
        try {
          // If all the height difference are within the accepted tolerence,
          // the result array should be empty (implying that it contained 0 error)
          expect(results.value.length).to.equal(0);
        } catch (error) {
          // Manual try...catch logic is used to mitigate the lack of
          // native chai expect support inside Nightwatch.
          // Otherwise, if there is an assertion error, Nightwatch will simply stopped running.
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
