import urlHelper from 'src/helpers/url';

describe('URL Helper', () => {
  describe('getParameterByName', () => {
    it('should get the value of the given query string', () => {
      const expectedResult = 'pages';

      const inputQueryString = 'viewMode';
      const inputUrl = `https://www.website.com/#/content?${inputQueryString}=${expectedResult}`;
      const outputResult = urlHelper.getParameterByName(inputQueryString, inputUrl);

      expect(outputResult).to.equal(expectedResult);
    });

    it('should work when there are other query string', () => {
      const expectedResult = 'pages';

      const inputQueryString = 'viewMode';
      const inputUrl = `https://www.website.com/#/content?other=value&${inputQueryString}=${expectedResult}`;
      const outputResult = urlHelper.getParameterByName(inputQueryString, inputUrl);

      expect(outputResult).to.equal(expectedResult);
    });

    it('should return null if query string is not found', () => {
      const expectedResult = null;

      const inputQueryString = 'viewMode';
      const inputUrl = `https://www.website.com/#/content?notViewMode=${expectedResult}`;
      const outputResult = urlHelper.getParameterByName(inputQueryString, inputUrl);

      expect(outputResult).to.equal(expectedResult);
    });
  });
});
