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
      }, [textLoader.load('references/full-documents')], () => {
        browser
          .waitForElementPresent('.page-view:nth-child(24)', 5000, '24 pages are rendered');
      });
  },

  'all content should render correctly': (browser) => {
    browser
      .assert.elementCount('p', 130)
      .assert.elementCount('a', 40)
      .assert.elementCount('img', 3)
      .assert.elementCount('ul', 8)
      .assert.elementCount('li', 32)
      .assert.elementCount('pre', 120)
      .assert.elementCount('code', 136)
      .assert.elementCount('table', 0)
      .assert.elementCount('img', 3)
      .assert.elementCount('h1', 1)
      .assert.elementCount('h2', 4)
      .assert.elementCount('h3', 15)
      .assert.elementCount('h4', 0)
      .assert.elementCount('h5', 0)
      .assert.elementCount('h6', 0)
      .assert.elementCount('strong', 2)
      .assert.elementCount('hr', 4);
  },

  'after': (browser) => {
    browser.end();
  },

};
