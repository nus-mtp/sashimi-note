function createDoc(browser, docType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser.execute(() => {
    const className = `.${docType}`;
    const numFiles = document.querySelectorAll(className).length;

    return numFiles;
  }, [docType], (numFiles) => {
    try {
      const button = `#button-create-${docType}`;

      browser
        .click(button);

      browser
        .expect(numFiles.value).to.equal(numFiles.value+1);
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
