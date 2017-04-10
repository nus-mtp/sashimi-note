import iframeBuilder from 'src/helpers/iframeBuilder';

describe('iframe Builder', () => {
  describe('getDocument', () => {
    it('should get the document of an iframe', () => {
      // Initialise data
      const iframeTestObj = document.createElement('iframe');
      iframeTestObj.id = 'iframeBuilder-spec-iframe';

      // Insert iframe to DOM tree, this will construct the iframe
      document.body.appendChild(iframeTestObj);
      const expectedResult = iframeTestObj.contentWindow.document;
      const outputResult = iframeBuilder.getDocument(iframeTestObj);
      expect(outputResult).to.equal(expectedResult);

      // Clean up
      document.body.removeChild(iframeTestObj);
    });

    it('should get null if the iframe is not in the DOM tree', () => {
      const iframeTestObj = document.createElement('iframe');
      expect(() => {
        iframeBuilder.getDocument(iframeTestObj);
      }).to.throw(Error);
    });
  });
});
