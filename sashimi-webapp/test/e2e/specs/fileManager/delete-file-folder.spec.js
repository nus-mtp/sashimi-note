function deleteDoc(browser, docType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  const createButton = `#button-create-${docType}`;

  browser
    .click(createButton)
    .pause(500);

  browser.execute((data) => {
    const className = `.${data}`;
    const currentNumDocs = document.querySelectorAll(className).length;

    return currentNumDocs;
  }, [docType], (result) => {
    const previousNumDocs = result.value;
    const expectedNumDocs = previousNumDocs - 1;

    const className = `.${docType}`;
    const deleteButton = '#button-delete';

    browser
      .click(className)
      .pause(700)
      .click(deleteButton)
      .pause(500);

    browser
    .assert.elementCount(className, expectedNumDocs);
  });
}
describe('FileManager\'s delete file/folder button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should delete a file', (browser) => {
    deleteDoc(browser, 'file');
  });

  it('should delete a folder', (browser) => {
    deleteDoc(browser, 'folder');
  });
});
