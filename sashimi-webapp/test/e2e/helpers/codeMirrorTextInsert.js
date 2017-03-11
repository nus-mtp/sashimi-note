/**
 * A helper module that is used to set text on a CodeMirror area.
 * This module will find the first CodeMirror for the text insertion.
 * @param {Browser} browser - Nightwatch browser instance
 * @param {string} data - text content that will be set onto the CodeMirror area
 */
const codeMirrorTextInsert = (browser, data) => {
  browser.execute((browserData) => {
    const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
    codeMirrorInstance.setValue(browserData);
  }, [data]);
};

module.exports = codeMirrorTextInsert;
