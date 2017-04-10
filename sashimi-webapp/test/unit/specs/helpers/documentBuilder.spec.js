import documentBuilder from 'src/helpers/documentBuilder';

describe('document Builder', () => {
  describe('getDocument', () => {
    it('should get the document of an iframe', () => {
      // Initialise data
      const iframeTestObj = document.createElement('iframe');

      // Insert iframe to DOM tree, this will construct the iframe
      document.body.appendChild(iframeTestObj);
      const expectedResult = iframeTestObj.contentWindow.document;
      const outputResult = documentBuilder.getDocument(iframeTestObj);
      expect(outputResult).to.equal(expectedResult);

      // Clean up
      document.body.removeChild(iframeTestObj);
    });

    it('should get null if the iframe is not in the DOM tree', () => {
      const iframeTestObj = document.createElement('iframe');
      expect(() => {
        documentBuilder.getDocument(iframeTestObj);
      }).to.throw(Error);
    });

    it('should get the document of a window object', () => {
      const outputResult = documentBuilder.getDocument(window);
      expect(outputResult).to.equal(window.document);
    });

    it('should get the document of an iframe window object', () => {
      // Initialise data
      const iframeTestObj = document.createElement('iframe');
      document.body.appendChild(iframeTestObj);

      const outputResult = documentBuilder.getDocument(iframeTestObj.contentWindow);
      expect(outputResult).to.equal(iframeTestObj.contentWindow.document);

      document.body.removeChild(iframeTestObj);
    });
  });
  describe('rebuild', () => {
    it('should return a document with proper doctype', () => {
      // Initialise data
      const iframeTestObj = document.createElement('iframe');
      document.body.appendChild(iframeTestObj);
      documentBuilder.rebuild(iframeTestObj);

      const frameDoc = iframeTestObj.contentWindow.document;

      // .doctype is a null if the document does not have a doctype
      expect(frameDoc.doctype).to.not.be.a.null;
      if (frameDoc.doctype) {
        expect(frameDoc.doctype.name).to.equal('html');
      }

      document.body.removeChild(iframeTestObj);
    });

    it('should return a document of HTML with head and body', () => {
      // Initialise data
      const iframeTestObj = document.createElement('iframe');
      document.body.appendChild(iframeTestObj);
      documentBuilder.rebuild(iframeTestObj);

      const frameDoc = iframeTestObj.contentWindow.document;

      expect(frameDoc.head).to.not.be.a.null;
      expect(frameDoc.body).to.not.be.a.null;

      document.body.removeChild(iframeTestObj);
    });
  });

  // TODO Write test for addStyle
    // describe('addStyle', () => {
    // describe('addStyles', () => {
});
