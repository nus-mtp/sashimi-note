module.exports = (browser, data) => {
  browser.execute((browserData) => {
    const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
    codeMirrorInstance.setValue(browserData);
  }, [data]);
};
