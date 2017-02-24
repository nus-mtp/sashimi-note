import documentFormatter from 'src/logic/documentPackager/documentFormatter';
import base64OfSimplePdf from './reference/base64OfSimplePdf';

describe('DocumentFormatter', () => {
  it('should returns the same data for \'html viewMode\'', () => {
    const viewMode = 'html';
    const inputData = '<div>This is a HTML content</div>';
    const outputData = documentFormatter.format(inputData, viewMode);

    expect(outputData).to.equal('<div>This is a HTML content</div>');
  });

  it('should returns a pdfBlob for \'pages viewMode\'', (done) => {
    const expectedOutput = base64OfSimplePdf;
    const inputData = '<div>This is a HTML content</div>';

    const thatPromise = documentFormatter.getPdfBlob(inputData);

    thatPromise.then((outputData) => {
      // jsPDF does not give deterministic outputData
      // around 5 characters will always be different in the output
      // therefore, an approximation method to use content length for
      // testing is used.

      expect(outputData.length).to.equal(expectedOutput.length);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
