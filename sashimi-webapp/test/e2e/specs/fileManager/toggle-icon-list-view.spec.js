function toCamelCase(str) {
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}

function toggleIconListView(browser, viewType) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/`);
  browser.expect.element('#app').to.be.visible.before(5000);

  const viewTypeButton = `#button-${viewType}`;

  browser
    .click(viewTypeButton)
    .pause(700);

  const className = `.${toCamelCase(viewType)}`;

  browser
    .expect.element(className)
    .to.be.present;
}

describe('FileManager\'s toggle icon, list view buttons', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should change documents to list view', (browser) => {
    toggleIconListView(browser, 'list-view');
  });

  it('should change documents to icon view', (browser) => {
    toggleIconListView(browser, 'icon-view');
  });
});
