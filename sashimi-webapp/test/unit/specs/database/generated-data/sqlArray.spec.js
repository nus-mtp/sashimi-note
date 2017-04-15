import SqlArray from 'src/database/generated-data/sqlArray';

const alasqlArray = new SqlArray();

describe('sqlArray', () => {
  describe('creation of datastructure for alasql', () => {
    it('should create an empty object of object', () => {
      alasqlArray.initializeAlasqlArray();
      const alaArray = alasqlArray.endAlasqlArray();
      expect(alaArray).to.deep.equal([{}]);
      expect(typeof alaArray).to.equal('object');
      expect(typeof alaArray[0]).to.equal('object');
      expect(typeof Object.values(alaArray[0])).to.equal.null;
    });

    it('should fill up an object of object', () => {
      alasqlArray.initializeAlasqlArray();
      alasqlArray.addKeyBasePair('a', 123);
      alasqlArray.addKeyBasePair('b', '123');
      const alaArray = alasqlArray.endAlasqlArray();
      expect(alaArray).to.deep.equal([{ a: 123, b: '123' }]);
      expect(typeof alaArray).to.equal('object');
      expect(typeof alaArray[0]).to.equal('object');
      expect(typeof Object.values(alaArray[0])).to.equal.null;
    });

    it('should fill up multiple objects', () => {
      alasqlArray.initializeAlasqlArray();
      alasqlArray.addKeyBasePair('a', 123);
      alasqlArray.addKeyBasePair('b', '123');
      alasqlArray.initializeNextAlasqlArray();
      alasqlArray.addKeyBasePair('c', 456);
      alasqlArray.addKeyBasePair('d', '789');
      const alaArray = alasqlArray.endAlasqlArray();
      expect(alaArray).to.deep.equal([{ a: 123, b: '123' }, { c: 456, d: '789' }]);
      expect(typeof alaArray).to.equal('object');
      expect(typeof alaArray[0]).to.equal('object');
      expect(typeof Object.values(alaArray[0])).to.equal.null;
    });
  });
});
