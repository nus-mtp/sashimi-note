function createDoc(browser, docType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser.execute(() => {
    const className = `.${docType}`;
    const numDocs = document.querySelectorAll(className).length;

    return numDocs;
  }, [docType], (numDocs) => {
    try {
      const createButton = `#button-create-${docType}`;
      const numDocsAfterCreate = numDocs.value + 1;

      browser
        .click(createButton)
        .pause(500);

      browser
        .expect(numDocs.value).to.equal(numDocsAfterCreate);
    } catch (error) {
      console.log(error);
    }
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
