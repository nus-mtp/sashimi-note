const textLoader = require('../../helpers/textLoader');
const pagesModeActivation = require('./pages-mode-activation');
const codeMirrorTextInsert = require('../../helpers/codeMirrorTextInsert');

describe('Content transfer', () => {
  it('should render all elements in "full-documents.txt"', (browser) => {
    pagesModeActivation(browser);
    codeMirrorTextInsert(browser, textLoader.load('references/full-documents'));

    // A hardcoded test for the specific 'full-documents.txt'
    // TODO: need to included test for MathJax too.
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
