const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

describe('Viewer\'s manage file button', function() {
  it('should render oversized content in the next page if it is not the first item in the page', (browser) => {
    pagesModeActivation(browser);
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
