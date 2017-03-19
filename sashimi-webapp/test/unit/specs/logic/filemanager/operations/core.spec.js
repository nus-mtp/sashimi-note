import core from 'src/logic/filemanager/operations/core';
import Folder from 'src/logic/filemanager/data/folder';
import File from 'src/logic/filemanager/data/file';

const dbFileList = [];
const dbFolderList = [];
const dbList = [dbFileList, dbFolderList];


/* eslint camelcase:0 */
function DBFolder(folder_id, folder_name, folder_path, parent_folder_id) {
  this.folder_id = folder_id;
  this.folder_name = folder_name;
  this.folder_path = folder_path;
  this.parent_folder_id = parent_folder_id;
}

function DBFile(file_id, file_name, file_path, folder_id) {
  this.file_id = file_id;
  this.file_name = file_name;
  this.file_path = file_path;
  this.folder_id = folder_id;
}

describe('core', () => {
  describe('init()', () => {
    it('should return root folder correctly', () => {
      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const rootFolder = new Folder(0, 'root', '/root/');

      dbFolderList.push(dbRootFolder);
      const result = core.init(dbList);
      // console.log('result: ', result);
      // console.log('expect: ', rootFolder);
      expect(result).to.deep.equal(rootFolder);
      // expect({ tea: 'green' }).to.deep.equal({ tea: 'green' });
      // expect(1).to.equal(1);
    });
  });
});
