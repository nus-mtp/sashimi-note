const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');
const codeMirrorTextInsert = require('../../helpers/codeMirrorTextInsert');

describe('Page breaker ', () => {
  describe('Manual pagebreak handler', () => {
    it('should push element subsequent to pagebreak to the next page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/pagebreak-between-elements'));

      browser
        .expect.element('.page-view:nth-child(4)')
        .to.be.present.before(5000);
    });
  });

  describe('Oversized content handler', () => {
    it('should render dangling oversized content to the next page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/oversized-content-at-middle'));

      browser
        .expect.element('.page-view:nth-child(4)')
        .to.be.present.before(5000);
      browser
        .expect.element('.page-view:nth-child(3) pre code')
        .to.be.present.before(5000);
    });

    it('should render oversized content that begins on a new page to the same page', (browser) => {
      pagesModeActivation(browser);
      codeMirrorTextInsert(browser, textLoader.load('references/oversized-content-at-beginning'));

      browser
        .expect.element('.page-view:nth-child(3)')
        .to.be.present.before(5000);
      browser
        .expect.element('.page-view:nth-child(2) pre code')
        .to.be.present.before(5000);
    });
  });

  afterEach((browser, done) => {
    browser.end(() => done());
  });
});
