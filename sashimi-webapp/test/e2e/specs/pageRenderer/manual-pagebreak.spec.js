const textLoader = require('../../helpers/textLoader');

module.exports = {
  'navigate to /content': (browser) => {
    const devServer = browser.globals.devServerURL;

    browser
      .url(`${devServer}/content`)
      .waitForElementVisible('#app', 5000);
  },

  'verify the HTML in /content': (browser) => {
    browser
      .assert.elementPresent('.viewer')
      .assert.elementPresent('#viewer-container')
      .assert.elementPresent('#manage-file');
  },

  'change fileFormat to Pages mode': (browser) => {
    browser
      .click('#manage-file')
      .pause(500)
      .click('button[data-format="pages"]')
      .pause(500)
      .assert.elementPresent('.viewer[data-fileformat="pages"]');
  },

  'write to codemirror': (browser) => {
    browser
      .click('.CodeMirror')
      .pause(500)
      .keys(textLoader.load('references/pagebreak-between-elements'), () => {
        browser.pause(2000)
        .assert.elementCount('.page-view', 4);
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
