module.exports = (browser, data) {
  browser.execute((data) => {
    const codeMirrorInstance = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
    codeMirrorInstance.setValue(data);
  }, [data]);
};
