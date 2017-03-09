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
      .execute((data) => {
        const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
        codeMirrorInstance.setValue(data);
      }, [textLoader.load('references/oversized-content-at-beginning')], () => {
        browser
          .waitForElementPresent('.page-view:nth-child(3)', 5000, '3 pages are rendered')
          .waitForElementPresent('.page-view:nth-child(2) pre code', 5000, 'Code block is rendered in page 2');
      });
  },

  'after': (browser) => {
    browser.end();
  },

};
