const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');

describe('Content transfer', () => {
  it('should render all elements in "full-documents.txt"', (browser) => {
    pagesModeActivation(browser);
    browser
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/full-documents')], () => {
        browser.expect.element('.page-view:nth-child(24)').to.be.present.before(5000);
      });

    browser
      .assert.elementCount('p', 130)
      .assert.elementCount('a', 40)
      .assert.elementCount('img', 3)
      .assert.elementCount('ul', 8)
      .assert.elementCount('li', 32)
      .assert.elementCount('pre', 120)
      .assert.elementCount('code', 136)
      .assert.elementCount('table', 0)
      .assert.elementCount('img', 3)
      .assert.elementCount('h1', 1)
      .assert.elementCount('h2', 4)
      .assert.elementCount('h3', 15)
      .assert.elementCount('h4', 0)
      .assert.elementCount('h5', 0)
      .assert.elementCount('h6', 0)
      .assert.elementCount('strong', 2)
      .assert.elementCount('hr', 4);
  });

  afterEach((browser, done) => {
    browser.end(() => done());
  });
});
