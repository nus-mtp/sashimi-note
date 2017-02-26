import JsPDF from 'jspdf';
import base64 from 'src/helpers/base64';

const defaultPageSize = {
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
};

/**
  * Convert HTML string into a jsPDF output
  * @param {string} htmlString - HTML string
  * @param {object} paperSize
  * @return {Promise<jsPDFDoc>} jsPDF output
  */
const createPdfFromHtml = function createPdfFromHtml(htmlString, renderConfig) {
  const processedHtmlString = htmlString || '<div></div>';

  return new Promise((resolve, reject) => {
    const paperSize = renderConfig.paperSize || defaultPageSize;
    const doc = new JsPDF(paperSize);

    // Beta Stage API provided by JsPDF
    // Source code can be viewed at:
    // https://github.com/MrRio/jsPDF/blob/master/plugins/from_html.js

    doc.fromHTML(processedHtmlString, 10, 0, {
      width: renderConfig.width
    }, (dispose) => {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html
      if (dispose) {
        resolve(doc.output());
      } else {
        // dispose will be undefined or false is jsPDF failed to render
        reject('Error creating pdf with jsPDF');
      }
    }, { top: 20, bottom: 20 });
  });
};

export default {
  getPdfBase64(htmlString, paperSize) {
    return createPdfFromHtml(htmlString, paperSize)
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
