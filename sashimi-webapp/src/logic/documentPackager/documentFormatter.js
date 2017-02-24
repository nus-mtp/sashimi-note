export default {
  format: function format(data) {
    // Return data as it is for now.
    return data;
  },

  getPdfBlob: function getPdfBlob(data) {
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
};
