const activatePagesMode = function activatePagesMode(browser) {
  const devServer = browser.globals.devServerURL;

  browser.url(`${devServer}/content`);
  browser.expect.element('#app').to.be.visible.before(5000);

  browser.expect.element('.viewer').to.be.present;
  browser.expect.element('#viewer-container').to.be.present;
  browser.expect.element('#manage-file').to.be.present;

  browser
    .click('#manage-file')
    .pause(500)
    .click('button[data-format="pages"]')
    .pause(500);
  browser.expect.element('.viewer[data-fileformat="pages"]').to.be.present.before(1000);
};

describe('Viewer\'s manage file button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should activate Pages mode', (browser) => {
    activatePagesMode(browser);
  });
});

module.exports = activatePagesMode;
