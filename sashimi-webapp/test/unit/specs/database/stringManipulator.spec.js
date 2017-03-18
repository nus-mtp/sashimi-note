import StringManipulation from 'src/database/stringManipulation';

const stringManipulator = new StringManipulation();

describe('stringManipulation.js', () => {
  describe('concatenation of string', () => {
    it('should concat empty string', () => {
      const emptyString = stringManipulator.stringConcat('');
      expect(emptyString).to.equal('');
    });

    it('should concat null string as empty string', () => {
      const nullString = stringManipulator.stringConcat(null);
      expect(nullString).to.equal('');
    });

    it('should concat numbers', () => {
      const numberString = stringManipulator.stringConcat(123);
      expect(numberString).to.equal('123');
    });

    it('should concat multiple contents', () => {
      const multipleContents = stringManipulator.stringConcat('', null, 123, 'happy birthday to you');
      expect(multipleContents).to.equal('123happy birthday to you');
    });
  });

  describe('dateTime formatting', () => {
    it('should add a 0 to single digit', () => {
      const singleDigit = 1;
      const doubleDigits = stringManipulator.stringDateTime00Format(singleDigit);
      expect(doubleDigits).to.be.a.string;
      expect(doubleDigits).to.equal('01');
    });

    it('retain digits for double digits', () => {
      const doubleDigits = stringManipulator.stringDateTime00Format(35);
      expect(doubleDigits).to.be.a.number;
      expect(doubleDigits).to.equal(35);
    });
  });

  describe('replace all instance', () => {
    it('should add strings to empty string', () => {
      const originalString = 'lectureNote';
      const updatedString = stringManipulator.replaceAll(originalString, '', '.');
      expect(updatedString).to.be.a.string;
      expect(updatedString).to.equal('.l.e.c.t.u.r.e.N.o.t.e.');
    });

    it('should replace strings that occur once', () => {
      const originalString = 'The Quick Brown Fox Jump Over Lazy Dog';
      let updatedString = stringManipulator.replaceAll(originalString, 'Quick', 'Slow');
      expect(updatedString).to.be.a.string;
      expect(updatedString).to.equal('The Slow Brown Fox Jump Over Lazy Dog');
      updatedString = stringManipulator.replaceAll(updatedString, 'Dog', 'Cat');
      expect(updatedString).to.equal('The Slow Brown Fox Jump Over Lazy Cat');
      updatedString = stringManipulator.replaceAll(updatedString, 'Dog', 'Wolf');
      expect(updatedString).to.not.equal('The Slow Brown Fox Jump Over Lazy Wolf');
    });

    it('should replace strings that occur multiple times', () => {
      const originalString = 'The Quick Brown Fox Jump Over Lazy Dog';
      let updatedString = stringManipulator.replaceAll(originalString, 'Quick', 'LazyLazy');
      expect(updatedString).to.be.a.string;
      expect(updatedString).to.equal('The LazyLazy Brown Fox Jump Over Lazy Dog');
      updatedString = stringManipulator.replaceAll(updatedString, 'Lazy', 'Fat');
      expect(updatedString).to.equal('The FatFat Brown Fox Jump Over Fat Dog');
    });
  });
});

