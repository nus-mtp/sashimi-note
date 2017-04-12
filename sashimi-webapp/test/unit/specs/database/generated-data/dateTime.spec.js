import DateTime from 'src/database/generated-data/dateTime';

const dateTime = new DateTime();

describe('dateTime', () => {
  describe('create dateTime string for alasql format', () => {
    it('should be a string', () => {
      const currentDateTime = dateTime.getCurrentDateTime();
      expect(currentDateTime).to.be.a.string;
    });

    // the number 19 comes from the format of 'YYYY.MM.DD HH:MM:SS'
    // which has 19 characters
    it('should have a date length of 19 characters', () => {
      const currentDateTime = dateTime.getCurrentDateTime();
      expect(currentDateTime.length).to.equal(19);
    });

    it('should be able to retrieve a long time', () => {
      const currentDateTime = dateTime.getCurrentLongTime();
      expect(typeof currentDateTime).to.equal('number');
    });
  });
});
