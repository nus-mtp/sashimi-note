function focusDoc(browser, docType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  const createButton = `#button-create-${docType}`;
  const docToFocus = `.${docType}`;

  browser
    .click(createButton)
    .pause(500);

  browser
    .click(docToFocus)
    .pause(500);

  browser
    .expect.element('#button-delete .md-inactive')
    .to.not.be.present;

  browser
    .expect.element('#button-download .md-inactive')
    .to.not.be.present;
}
describe('FileManager\'s download and delete button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should be enable when a file is focused', (browser) => {
    focusDoc(browser, 'file');
  });

  it('should be created when a folder is focused', (browser) => {
    focusDoc(browser, 'folder');
  });
});
