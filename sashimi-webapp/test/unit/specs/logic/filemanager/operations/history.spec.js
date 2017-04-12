import History from 'src/logic/filemanager/operations/history';
import Folder from 'src/logic/filemanager/data/folder';
import idMap from 'src/logic/filemanager/data/idmap';

describe('History', () => {
  /* Test History() */
  describe('History()', () => {
    it('should throw an error if input is null', () => {
      expect(() => {
        /* eslint no-new:0 */
        new History();
      }).to.throw(Error);
    });
    it('should create History given a Folder', () => {
      const testFolder = new Folder(0);
      const testHistory = new History(testFolder);
      expect(testHistory.currFolderID).to.equal(testFolder.id);
    });
  });

  /* Test update() */
  describe('update()', () => {
    it('should throw an error if input is null', () => {
      expect(() => {
        const testFolder = new Folder(0);
        idMap.addFolderToMap(testFolder.id, testFolder);
        const testHistory = new History(testFolder);
        testHistory.update();
      }).to.throw(Error);
    });
    idMap.clearMap();
    it('should throw an error if input is the same as current folder', () => {
      expect(() => {
        const testFolder = new Folder(0);
        idMap.addFolderToMap(testFolder.id, testFolder);
        const testHistory = new History(testFolder);
        testHistory.update(testFolder);
      }).to.throw(Error);
    });
    idMap.clearMap();
    it('should update current folder correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);
      const testHistory = new History(testFolder1);
      expect(testHistory.update(testFolder2)).to.equal(testFolder2);
    });
    idMap.clearMap();
    it('should update previous history correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedPreviousHistory = [testFolder1.id];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      expect(testHistory.previousHistory).to.deep.equal(expectedPreviousHistory);
    });
    idMap.clearMap();
    it('should clear next history', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedNextHistory = [];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      expect(testHistory.nextHistory).to.deep.equal(expectedNextHistory);
    });
    idMap.clearMap();
  });

  /* Test previous() */
  describe('previous()', () => {
    it('should update current folder correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      expect(testHistory.previous()).to.equal(testFolder1);
    });
    idMap.clearMap();
    it('should update previous history correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedPreviousHistory = [];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      testHistory.previous();
      expect(testHistory.previousHistory).to.deep.equal(expectedPreviousHistory);
    });
    idMap.clearMap();
    it('should update next history correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedNextHistory = [testFolder2.id];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      testHistory.previous();
      expect(testHistory.nextHistory).to.deep.equal(expectedNextHistory);
    });
    idMap.clearMap();
    it('should return current folder if previous history is empty', () => {
      const testFolder1 = new Folder(0);
      const testHistory = new History(testFolder1);
      idMap.addFolderToMap(testFolder1.id, testFolder1);

      expect(testHistory.previous()).to.equal(testFolder1);
    });
    idMap.clearMap();
  });

  /* Test next() */
  describe('next()', () => {
    it('should update current folder correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      testHistory.previous();
      expect(testHistory.next()).to.equal(testFolder2);
    });
    idMap.clearMap();
    it('should update previous history correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedPreviousHistory = [testFolder1.id];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      testHistory.previous();
      testHistory.next();
      expect(testHistory.previousHistory).to.deep.equal(expectedPreviousHistory);
    });
    idMap.clearMap();
    it('should update next history correctly', () => {
      const testFolder1 = new Folder(1);
      const testFolder2 = new Folder(2);
      idMap.addFolderToMap(testFolder1.id, testFolder1);
      idMap.addFolderToMap(testFolder2.id, testFolder2);

      const expectedNextHistory = [];
      const testHistory = new History(testFolder1);
      testHistory.update(testFolder2);
      testHistory.previous();
      testHistory.next();
      expect(testHistory.nextHistory).to.deep.equal(expectedNextHistory);
    });
    idMap.clearMap();
    it('should return current folder if next history is empty', () => {
      const testFolder1 = new Folder(0);
      const testHistory = new History(testFolder1);
      idMap.addFolderToMap(testFolder1.id, testFolder1);

      expect(testHistory.next()).to.equal(testFolder1);
    });
    idMap.clearMap();
  });
});
