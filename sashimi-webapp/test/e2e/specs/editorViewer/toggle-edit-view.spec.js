const toggleEditView = function toggleEditorViewerView(browser) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/content`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser
    .click('#button-editor')
    .pause(700);

  browser.getCssProperty('body', 'width', (renderResult) => {
    browser
      .expect.element('.editor-wrapper')
      .to.have.css('width')
      .which.equal(renderResult.value);

    browser
      .expect.element('.viewer-wrapper')
      .to.have.css('width')
      .which.equal('0px');
  });
};

describe('Viewer\'s toggle edit button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should change width of editor to 100% and viewer to 0px', (browser) => {
    toggleEditView(browser);
  });
});
