function toggleEditorViewerView(browser, component) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/content`);
  browser.expect.element('#app').to.be.visible.before(5000);

  const CSS_SELECTOR_REFERENCE_FRAME = `.${component}-wrapper`;
  const CSS_SELECTOR_RENDER_FRAME = 'body';
  let CSS_SELECTOR_COMPARE_FRAME = '';

  const button = `#button-${component}`;
  const propertyName = 'width';

  if (component === 'editor') {
    CSS_SELECTOR_COMPARE_FRAME = '.viewer-wrapper';
  } else if (component === 'viewer') {
    CSS_SELECTOR_COMPARE_FRAME = '.editor-wrapper';
  }

  browser
    .click(button)
    .pause(700);

  browser.getCssProperty(CSS_SELECTOR_RENDER_FRAME, propertyName, (renderResult) => {
    browser
      .expect.element(CSS_SELECTOR_REFERENCE_FRAME)
      .to.have.css(propertyName)
      .which.equal(renderResult.value);

    browser
      .expect.element(CSS_SELECTOR_COMPARE_FRAME)
      .to.have.css(propertyName)
      .which.equal('0px');
  });
}

function toggleSplitScreenView(browser) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/content`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser
    .click('#button-split-screen')
    .pause(700);

  browser.getCssProperty('.viewer-wrapper', 'width', (renderResult) => {
    browser
      .expect.element('.editor-wrapper')
      .to.have.css('width')
      .which.equal(renderResult.value);
  });
}

describe('Viewer\'s toggle view buttons', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should change width of editor to 100% and viewer to 0px', (browser) => {
    toggleEditorViewerView(browser, 'editor');
  });

  it('should change width of editor to 0px and viewer to 100%', (browser) => {
    toggleEditorViewerView(browser, 'viewer');
  });

  it('should change width of editor to 50% and viewer to 50%', (browser) => {
    toggleSplitScreenView(browser);
  });
});
