import DateTime from 'src/database/generated-data/dateTime';

const dateTime = new DateTime();

describe('dateTime', () => {
  describe('create dateTime string for alasql format', () => {
    it('should be a string', () => {
      const currentDateTime = dateTime.getCurrentDateTime();
      expect(currentDateTime).to.be.a.string;
    });

    it('should have a date length of 19 characters', () => {
      const currentDateTime = dateTime.getCurrentDateTime();
      expect(currentDateTime.length).to.equal(19);
    });
  });
});
