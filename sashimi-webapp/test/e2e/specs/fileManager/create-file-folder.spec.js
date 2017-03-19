function createDoc(browser, docType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser.execute((data) => {
    const className = `.${data}`;
    const currentNumDocs = document.querySelectorAll(className).length;

    return currentNumDocs;
  }, [docType], (result) => {
    const className = `.${docType}`;
    const createButton = `#button-create-${docType}`;
    const previousNumDocs = result.value;
    const expectedNumDocs = previousNumDocs + 1;

    browser
        .click(createButton)
        .pause(500);

    browser
      .assert.elementCount(className, expectedNumDocs);
  });
}
describe('FileManager\'s create file/folder button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should create a new file', (browser) => {
    createDoc(browser, 'file');
  });

  it('should create a new folder', (browser) => {
    createDoc(browser, 'folder');
  });
});
