const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

describe('Render oversized content in the next page if it is not the first item in the page', function() {
  before((browser, done) => {
    pagesModeActivation(browser, done);
  });

  it('should attempt to insert code block into page 2 and render it at page 3', (browser) => {
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/oversized-content-at-middle')], () => {
        browser
          .expect.element('.page-view:nth-child(4)')
          .to.be.present.before(5000);
        browser
          .expect.element('.page-view:nth-child(3) pre code')
          .to.be.present.before(5000);
      });
  });

  after((browser, done) => {
    browser.end(() => done());
  });
});
