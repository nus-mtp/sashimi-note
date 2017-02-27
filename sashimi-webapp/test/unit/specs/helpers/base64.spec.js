import base64 from 'src/helpers/base64';

describe('Base-64', () => {
  describe('encode unicode', () => {
    it('should encode a data string into base-64 format', () => {
      const inputData = 'SASHIMI note, number 1234.5!?@\'"';
      const outputData = base64.encodeUnicode(inputData);
      const expected = 'U0FTSElNSSBub3RlLCBudW1iZXIgMTIzNC41IT9AJyI=';

      expect(outputData).to.equal(expected);
    });

    it('should encode a empty string into a empty string', () => {
      const inputData = '';
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.equal('');
    });

    it('should return a null object if input is null', () => {
      const inputData = null;
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.be.a('null');
    });

    it('should return a null object if input is undefined', () => {
      const inputData = undefined;
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.be.a('null');
    });

    it('should encode a number 0 into base-64 format', () => {
      const inputData = 0;
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.equal('MA==');
    });

    it('should encode a string \'0\' as number 0', () => {
      const inputData = '0';
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.equal('MA==');
    });

    it('should encode a boolean false as a string false', () => {
      const inputData = false;
      const outputData = base64.encodeUnicode(inputData);
      expect(outputData).to.equal('ZmFsc2U=');
    });
  });
});
