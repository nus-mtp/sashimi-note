import idMap from 'src/logic/filemanager/data/idmap';
import File from 'src/logic/filemanager/data/file';
import Folder from 'src/logic/filemanager/data/folder';

describe('idMap', () => {
  /* Test addFileToMap() */
  describe('addFileToMap()', () => {
    it('should throw an error if file ID is null', () => {
      expect(() => {
        const testFile = new File();
        idMap.addFileToMap(null, testFile);
      }).to.throw(Error);
    });
    it('should throw an error if file is null', () => {
      expect(() => {
        const testFileID = 0;
        idMap.addFileToMap(testFileID, null);
      }).to.throw(Error);
    });
  });

  /* Test addFolderToMap() */
  describe('addFolderToMap()', () => {
    it('should throw an error if folder ID is null', () => {
      expect(() => {
        const testFolder = new Folder();
        idMap.addFolderToMap(null, testFolder);
      }).to.throw(Error);
    });
    it('should throw an error if folder is null', () => {
      expect(() => {
        const testFolderID = 0;
        idMap.addFolderToMap(testFolderID, null);
      }).to.throw(Error);
    });
  });

  /* Test getFileFromMap() */
  describe('getFileFromMap()', () => {
    it('should throw an error if file ID is null', () => {
      expect(() => {
        idMap.getFileFromMap(null);
      }).to.throw(Error);
    });
    it('should return undefined if file is not found', () => {
      expect(idMap.getFileFromMap(0)).to.equal(undefined);
    });
    it('should return the file if it is found', () => {
      const expectedFile = new File(0);
      idMap.addFileToMap(0, expectedFile);
      expect(idMap.getFileFromMap(0)).to.equal(expectedFile);
    });
  });

  /* Test getFolderFromMap() */
  describe('getFolderFromMap()', () => {
    it('should throw an error if folder ID is null', () => {
      expect(() => {
        idMap.getFolderFromMap(null);
      }).to.throw(Error);
    });
    it('should return undefined if folder is not found', () => {
      expect(idMap.getFolderFromMap(0)).to.equal(undefined);
    });
    it('should return the folder if it is found', () => {
      const expectedFolder = new Folder(0);
      idMap.addFolderToMap(0, expectedFolder);
      expect(idMap.getFolderFromMap(0)).to.equal(expectedFolder);
    });
  });

   /* Test removeFileFromMap() */
  describe('removeFileFromMap()', () => {
    it('should throw an error if file ID is null', () => {
      expect(() => {
        idMap.removeFileFromMap(null);
      }).to.throw(Error);
    });
  });

  /* Test removeFolderFromMap() */
  describe('removeFolderFromMap()', () => {
    it('should throw an error if folder ID is null', () => {
      expect(() => {
        idMap.removeFolderFromMap(null);
      }).to.throw(Error);
    });
  });
});
