import JsPDF from 'jspdf';
import base64 from 'src/helpers/base64';

/**
  * Convert HTML string into a jsPDF output
  * @param {string} htmlString - HTML string
  * @return {Promise<jsPDFDoc>} jsPDF output
  */
const createPdfFromHtml = function createPdfFromHtml(htmlString) {
  const processedHtmlString = htmlString || '<div></div>';

  return new Promise((resolve, reject) => {
    const doc = new JsPDF();

    // Beta Stage API provided by JsPDF
    // Source code can be viewed at:
    // https://github.com/MrRio/jsPDF/blob/master/plugins/from_html.js

    doc.fromHTML(processedHtmlString, 15, 15, {
      width: 170
    }, (dispose) => {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html
      if (dispose) {
        resolve(doc.output());
      } else {
        // dispose will be undefined or false is jsPDF failed to render
        reject('Error creating pdf with jsPDF');
      }
    });
  });
};

export default {
  getPdfBase64(htmlString) {
    return createPdfFromHtml(htmlString)
    .then((pdfOutput) => {
      const base64PdfUri = base64.encodeUnicode(pdfOutput);
      return `data:application/pdf;base64, ${base64PdfUri}`;
    });
  },
  format: function format(data) {
    // Return data as it is for now.
    return data;
  }
};
