import elementUtils from 'src/helpers/elementUtils';

describe('Element Utils', () => {
  describe('Resolve Element', () => {
    it('should resolve the same element if its parameter is an element', () => {
      const paragraphElRef = document.createElement('p');
      const outputData = elementUtils.resolveElement(paragraphElRef);

      expect(outputData).to.equal(paragraphElRef);
    });

    it('should resolve the correct element with the right ID', () => {
      const paragraphElRef = document.createElement('p');
      const elementId = 'test-id-for-element-utils';
      paragraphElRef.setAttribute('id', elementId);
      document.body.appendChild(paragraphElRef);

      const outputData = elementUtils.resolveElement(elementId);
      expect(outputData).to.equal(paragraphElRef);

      // Clean up create element
      document.body.removeChild(paragraphElRef);
    });

    it('should return null it cannot resolve the element with the provided ID', () => {
      const elementId = `this-element-should-not-exist-${new Date().getTime}`;
      const outputData = elementUtils.resolveElement(elementId);

      expect(outputData).to.be.a.null;
    });

    it('should resolve the correct element in custom document with the right ID', () => {
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      const frameDocument = frame.contentWindow.document;

      const paragraphElRef = frameDocument.createElement('p');
      const elementId = 'test-id-for-element-utils';
      paragraphElRef.setAttribute('id', elementId);
      frameDocument.body.appendChild(paragraphElRef);

      const outputData = elementUtils.resolveElement(elementId, frameDocument);
      expect(outputData).to.equal(paragraphElRef);

      // Clean up create element
      document.body.removeChild(frame);
    });

    it('should resolve the same element if its parameter is an element regardless of the provided altDocument', () => {
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      const frameDocument = frame.contentWindow.document;

      const paragraphElRef = frameDocument.createElement('p');
      frameDocument.body.appendChild(paragraphElRef);

      const outputData = elementUtils.resolveElement(paragraphElRef);
      expect(outputData).to.equal(paragraphElRef);

      // Clean up create element
      document.body.removeChild(frame);
    });
  });
});
