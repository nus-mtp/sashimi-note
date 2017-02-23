import JsPDF from 'jspdf';

// Encode data into Base-64 unicode string
const b64EncodeUnicode = function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) =>
      String.fromCharCode(`0x${p1}`)
    )
  );
};

const convertHtmlToPdfBlob = function convertHtmlToB64(htmlString) {
  const processedHtmlString = htmlString || '<div></div>';

  return new Promise((resolve, reject) => {
    const doc = new JsPDF();

    doc.fromHTML(processedHtmlString, 15, 15, {
      width: 170
    }, (dispose) => {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html

      const getPdfData = b64EncodeUnicode(doc.output());

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
  getPdfBlob(htmlString) {
    return convertHtmlToPdfBlob(htmlString);
  },

  format(data) {
    // Return data as it is for now.
    return data;
  }
};
