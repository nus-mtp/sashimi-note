/*
** HTML XSS Filtering plugin by leizongmin
** using https://github.com/leizongmin/js-xss
**
** Features:
** 1. Specifies HTML tags and their attributes allowed with whitelist
** 2. Handle any tags or attributes using custom function.
*/
const xssFilter = require('xss');

const documentFormatter = {
  format: function format(data) {
    // Filter out any possible XSS threat
    data = xssFilter(data);

    // Return data as it is for now.
    return data;
  }
};

module.exports = documentFormatter;
