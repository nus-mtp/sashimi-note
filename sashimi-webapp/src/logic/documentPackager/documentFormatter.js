import JsPDF from 'jspdf';
import base64 from 'src/helpers/base64';

const convertHtmlToPdfBase64 = function convertHtmlToB64(htmlString) {
  const processedHtmlString = htmlString || '<div></div>';

  return new Promise((resolve, reject) => {
    const doc = new JsPDF();

    doc.fromHTML(processedHtmlString, 15, 15, {
      width: 170
    }, (dispose) => {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html

      const getPdfData = base64.encodeUnicode(doc.output());

      // Catch empty pdf output.
      //   This error generally does not happen.
      //   TODO: It will be good to check what could be the potential
      //         fail cases for jspdf.
      if (!getPdfData) {
        reject('PDF output data is empty');
      }

      const url = `data:application/pdf;base64, ${getPdfData}`;
      resolve(url);
    });
  });
};

export default {
  getPdfBase64(htmlString) {
    return convertHtmlToPdfBase64(htmlString);
  },
  format: function format(data) {
    // Return data as it is for now.
    return data;
  }
};
