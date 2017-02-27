import unitConverter from 'src/helpers/unitConverter';

describe('Unit Converter', () => {
  describe('get', () => {
    it('should convert 2.54 cm to 1 inch', () => {
      const outputResult = unitConverter.get('2.54cm', 'in');
      expect(outputResult).to.equal('1in');
    });

    it('should convert 21 cm to 793.7 px', () => {
      const outputResult = unitConverter.get('21cm', 'px');
      expect(outputResult).to.equal('793.7007874015748px');
    });

    it('should convert input with space between value and unit type', () => {
      const outputResult = unitConverter.get('21 cm', 'px');
      expect(outputResult).to.equal('793.7007874015748px');
    });

    it('should throw an error for empty input', () => {
      expect(() => {
        unitConverter.get();
      }).to.throw(Error);
    });

    it('should throw an error for missing conversion type', () => {
      expect(() => {
        unitConverter.get('21px');
      }).to.throw(Error);
    });

    it('should throw an error for invalid input value', () => {
      expect(() => {
        unitConverter.get('a1b', 'px');
      }).to.throw(Error);
    });

    it('should throw an error for invalid target conversion type', () => {
      expect(() => {
        unitConverter.get('21cm', 'pk');
      }).to.throw(Error);
    });

    it('should throw an error for invalid source conversion type', () => {
      expect(() => {
        unitConverter.get('21', 'px');
      }).to.throw(Error);
    });
  });
});
