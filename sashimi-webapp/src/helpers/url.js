

export default {
  /**
  * Get the query string value of a url given its query name
  * @param {String} name of the query string
  * @param {String} url that you wish to query. If not supplied, give current window location
  * @return {String} value of the query
  */
  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    /* eslint no-useless-escape: 0 */
    name = name.replace(/[\[\]]/g, '\\$&');
    /* eslint prefer-template: 0 */
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};
