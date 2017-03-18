const activatePagesMode = function activatePagesMode(browser, callback) {
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

  if (typeof callback === 'function') browser.perform(() => callback());
};

describe('Viewer\'s manage file button', function() {
  after((browser, done) => {
    browser.end(() => done());
  });

  it('should activate Pages mode', (browser) => {
    activatePagesMode(browser);
  });
});

// Exporting this function since other test
// will need to activate page mode before testng
module.exports = activatePagesMode;
