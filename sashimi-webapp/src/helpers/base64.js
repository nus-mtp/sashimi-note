

export default {
  /**
  * Encode data into Base-64 unicode string
  * @param {any} data
  * @return {String} Base-64 unicode string of the data
  */
  encodeUnicode(data) {
    // == is used here so that undefined will be coercion to null
    if (data == null) return null;

    return btoa(
      encodeURIComponent(data).replace(/%([0-9A-F]{2})/g,
      (match, p1) =>
        String.fromCharCode(`0x${p1}`)
      )
    );
  }
};
