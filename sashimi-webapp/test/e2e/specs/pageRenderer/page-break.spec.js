const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

describe('Page breaker ', () => {
  describe('Manual pagebreak handler', () => {
    it('should push element subsequent to pagebreak to the next page', (browser) => {
      pagesModeActivation(browser);
      browser
        .execute(function(data) {
          const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
          codeMirrorInstance.setValue(data);
        }, [textLoader.load('references/pagebreak-between-elements')], function(codeMirrorInstance) {
          browser
            .expect.element('.page-view:nth-child(4)')
            .to.be.present.before(5000);
        });
    });
  });

  describe('Oversized content handler', () => {
    it('should render dangling oversized content to the next page', (browser) => {
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

    it('should render oversized content that begins on a new page to the same page', (browser) => {
      pagesModeActivation(browser);
      browser
        .execute((data) => {
          const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
          codeMirrorInstance.setValue(data);
        }, [textLoader.load('references/oversized-content-at-beginning')], () => {
          browser
            .expect.element('.page-view:nth-child(3)')
            .to.be.present.before(5000);
          browser
            .expect.element('.page-view:nth-child(2) pre code')
            .to.be.present.before(5000);
        });
    });
  });


  afterEach((browser, done) => {
    browser.end(() => done());
  });
});
