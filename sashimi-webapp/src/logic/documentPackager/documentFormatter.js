import JsPDF from 'jspdf';
import base64 from 'src/helpers/base64';

const defaultRenderConfig = {
  paperSize: {
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  },
  width: 170
};

/**
  * Convert HTML string into a jsPDF output
  * @param {string} htmlString - HTML string
  * @param {object} renderConfig - contain the paper size and text width
  * @return {Promise<jsPDFDoc>} jsPDF output
  */
const createPdfFromHtml = function createPdfFromHtml(htmlString, renderConfig) {
  const processedHtmlString = htmlString || '<div></div>';

  renderConfig = renderConfig || defaultRenderConfig;

  return new Promise((resolve, reject) => {
    const doc = new JsPDF(renderConfig.paperSize);

    // Beta Stage API provided by JsPDF
    // Source code can be viewed at:
    // https://github.com/MrRio/jsPDF/blob/master/plugins/from_html.js

    const pdfData = {
      html: processedHtmlString,
      offset: {
        x: 12,
        y: 12
      },
      sizing: {
        width: renderConfig.width
      },
      margin: {
        top: 0,
        bottom: 0
      },
      callback: ((dispose) => {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        if (dispose) {
          resolve(doc.output());
        } else {
          // dispose will be undefined or false is jsPDF failed to render
          reject('Error creating pdf with jsPDF');
        }
      })
    };

    // Generate PDF from the data above
    doc.fromHTML(
      pdfData.html,
      pdfData.offset.x,
      pdfData.offset.y,
      pdfData.sizing,
      pdfData.callback,
      pdfData.margin
    );
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
