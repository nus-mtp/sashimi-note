const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');
const codeMirrorTextInsert = require('../../helpers/codeMirrorTextInsert');

describe('Page breaker ', () => {
  describe('Headings', () => {
    it('should apply page break to headings located at the bottom of the page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/pagebreak-on-headers-at-bottom'));

      // The loaded document is purposelly filled until 17.9% before inserting
      // the last heading into the document.
      // There is sufficient space to fit the last heading into the first page.

      browser
        // 2 pages should be rendered with the last heading located at page 2
        .expect.element('.page-view:nth-child(2) h6')
        .to.be.present.before(5000);
    });

    it('should apply page break on dangling headings', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/pagebreak-on-dangling-headers'));

      // The loaded document will attempt to insert 2 headings elements into the document
      // Page 1 partially filled to allow space for the 2nd heading
      // The 2nd heading is then inserted into the document,
      // followed by a large chunk of text that cannot be fitted into page 1.

      browser
        // 2 pages should be rendered with the second heading located at page 2
        .expect.element('.page-view:nth-child(2) h2')
        .to.be.present.before(5000);
    });

    it('should apply page break to H1 element', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/pagebreak-before-h1-elements'));

      // The loaded document will attempt to insert 3 H1 elements into the document
      // Page 1 is filled with content.
      // Page 2 is half filled.

      browser
        // 3 pages should be rendered
        .expect.element('.page-view:nth-child(3)')
        .to.be.present.before(5000);
    });
  });

  describe('Manual pagebreak handler', () => {
    it('should push element subsequent to pagebreak to the next page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/pagebreak-between-elements'));

      // The loaded document will attempt to insert 3 page break syntax into the document

      browser
        // 4 pages should be rendered
        .expect.element('.page-view:nth-child(4)')
        .to.be.present.before(5000);
    });
  });

  describe('Oversized content handler', () => {
    it('should render dangling oversized content to the next page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/oversized-content-at-middle'));

      // The loaded document will attempt to fill up page 1 with multiple oneline paragraphs,
      // then insert a new paragraph in page 2 before trying to fit an oversized
      //   code block in the same page,
      // finally fill up the subsequent page with multiple oneline paragraphs again.

      browser
        // Check that 4 pages are rendered
        .expect.element('.page-view:nth-child(4)')
        .to.be.present.before(5000);
      browser
        // The code block inserted at page 2 should be pushed to page 3,
        // since the oversized item is not at the beginning of the page.
        .expect.element('.page-view:nth-child(3) pre code')
        .to.be.present.before(5000);
    });

    it('should render oversized content that begins on a new page to the same page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/oversized-content-at-beginning'));

      // Similar to the test above,
      // the loaded document will attempt to fill up page 1 with multiple oneline paragraphs,
      // however, nothing will be inserted to page 2 before the insertion of the oversized code block.
      // finally fill up the subsequent page with multiple oneline paragraphs again.

      browser
        // Check that 3 pages are rendered
        .expect.element('.page-view:nth-child(3)')
        .to.be.present.before(5000);
      browser
        // The code block should remain at page 2, since it is inserted
        // at the beginning of the page.
        .expect.element('.page-view:nth-child(2) pre code')
        .to.be.present.before(5000);
    });
  });

  afterEach((browser, done) => {
    browser.end(() => done());
  });
});
