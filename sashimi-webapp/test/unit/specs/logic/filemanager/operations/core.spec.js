import core from 'src/logic/filemanager/operations/core';
import idMap from 'src/logic/filemanager/data/idmap';
import Folder from 'src/logic/filemanager/data/folder';
import File from 'src/logic/filemanager/data/file';

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
      const dbFileList = [];
      const dbFolderList = [];
      const dbList = [dbFileList, dbFolderList];

      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const rootFolder = new Folder(0, 'root', '/root/');

      dbFolderList.push(dbRootFolder);
      expect(core.init(dbList)).to.deep.equal(rootFolder);
      idMap.clearMap();
    });

    it('should return 1st level child file list correctly', () => {
      const dbFileList = [];
      const dbFolderList = [];
      const dbList = [dbFileList, dbFolderList];

      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const dbChildFile1 = new DBFile(1, 'childFile1', '/root/childFile1/', 0);
      const dbChildFile2 = new DBFile(2, 'childFile2', '/root/childFile2/', 0);
      const dbChildFile3 = new DBFile(3, 'childFile3', '/root/childFile3/', 0);

      const rootFolder = new Folder(0, 'root', '/root/');
      const childFile1 = new File(1, 'childFile1', '/root/childFile1/', rootFolder);
      const childFile2 = new File(2, 'childFile2', '/root/childFile2/', rootFolder);
      const childFile3 = new File(3, 'childFile3', '/root/childFile3/', rootFolder);
      const childFileList = [childFile1, childFile2, childFile3];
      rootFolder.childFileList = childFileList;

      dbFolderList.push(dbRootFolder);
      dbFileList.push(dbChildFile1);
      dbFileList.push(dbChildFile2);
      dbFileList.push(dbChildFile3);

      expect(core.init(dbList).childFileList).to.deep.equal(childFileList);
      idMap.clearMap();
    });

    it('should return 2nd level child file list correctly', () => {
      const dbFileList = [];
      const dbFolderList = [];
      const dbList = [dbFileList, dbFolderList];

      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const dbFolder1 = new DBFolder(1, 'folder1', '/root/folder1/', 0);
      const dbChildFile1 = new DBFile(1, 'childFile1', '/root/folder1/childFile1/', 1);
      const dbChildFile2 = new DBFile(2, 'childFile2', '/root/folder1/childFile2/', 1);
      const dbChildFile3 = new DBFile(3, 'childFile3', '/root/folder1/childFile3/', 1);

      const rootFolder = new Folder(0, 'root', '/root/');
      const folder1 = new Folder(1, 'folder1', '/root/folder1/');
      const childFile1 = new File(1, 'childFile1', '/root/folder1/childFile1/', folder1);
      const childFile2 = new File(2, 'childFile2', '/root/folder1/childFile2/', folder1);
      const childFile3 = new File(3, 'childFile3', '/root/folder1/childFile3/', folder1);
      const childFileList = [childFile1, childFile2, childFile3];
      rootFolder.childFolderList.push(folder1);
      folder1.childFileList = childFileList;
      folder1.parentFolder = rootFolder;

      dbFolderList.push(dbRootFolder);
      dbFolderList.push(dbFolder1);
      dbFileList.push(dbChildFile1);
      dbFileList.push(dbChildFile2);
      dbFileList.push(dbChildFile3);

      const result = core.init(dbList);
      expect(result.childFolderList[0].childFileList).to.deep.equal(childFileList);
      idMap.clearMap();
    });

    it('should return 1st level child folder list correctly', () => {
      const dbFileList = [];
      const dbFolderList = [];
      const dbList = [dbFileList, dbFolderList];

      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const dbChildFolder1 = new DBFolder(1, 'childFolder1', '/root/childFolder1/', 0);
      const dbChildFolder2 = new DBFolder(2, 'childFolder2', '/root/childFolder2/', 0);
      const dbChildFolder3 = new DBFolder(3, 'childFolder3', '/root/childFolder3/', 0);

      const rootFolder = new Folder(0, 'root', '/root/');
      const childFolder1 = new Folder(1, 'childFolder1', '/root/childFolder1/');
      const childFolder2 = new Folder(2, 'childFolder2', '/root/childFolder2/');
      const childFolder3 = new Folder(3, 'childFolder3', '/root/childFolder3/');
      const childFolderList = [childFolder1, childFolder2, childFolder3];
      rootFolder.childFolderList = childFolderList;
      childFolder1.parentFolder = rootFolder;
      childFolder2.parentFolder = rootFolder;
      childFolder3.parentFolder = rootFolder;

      dbFolderList.push(dbRootFolder);
      dbFolderList.push(dbChildFolder1);
      dbFolderList.push(dbChildFolder2);
      dbFolderList.push(dbChildFolder3);

      expect(core.init(dbList).childFolderList).to.deep.equal(childFolderList);
      idMap.clearMap();
    });

    it('should return 2nd level child folder list correctly', () => {
      const dbFileList = [];
      const dbFolderList = [];
      const dbList = [dbFileList, dbFolderList];

      const dbRootFolder = new DBFolder(0, 'root', '/root/', -1);
      const dbLevel1Folder = new DBFolder(4, 'level1Folder', '/root/level1Folder/', 0);
      const dbChildFolder1 = new DBFolder(1, 'childFolder1', '/root/level1Folder/childFolder1/', 4);
      const dbChildFolder2 = new DBFolder(2, 'childFolder2', '/root/level1Folder/childFolder2/', 4);
      const dbChildFolder3 = new DBFolder(3, 'childFolder3', '/root/level1Folder/childFolder3/', 4);

      const rootFolder = new Folder(0, 'root', '/root/');
      const level1Folder = new Folder(4, 'level1Folder', '/root/level1Folder/');
      const childFolder1 = new Folder(1, 'childFolder1', '/root/level1Folder/childFolder1/');
      const childFolder2 = new Folder(2, 'childFolder2', '/root/level1Folder/childFolder2/');
      const childFolder3 = new Folder(3, 'childFolder3', '/root/level1Folder/childFolder3/');
      const childFolderList = [childFolder1, childFolder2, childFolder3];
      rootFolder.childFolderList.push(level1Folder);
      level1Folder.childFolderList = childFolderList;
      level1Folder.parentFolder = rootFolder;
      childFolder1.parentFolder = level1Folder;
      childFolder2.parentFolder = level1Folder;
      childFolder3.parentFolder = level1Folder;

      dbFolderList.push(dbRootFolder);
      dbFolderList.push(dbChildFolder1);
      dbFolderList.push(dbChildFolder2);
      dbFolderList.push(dbChildFolder3);
      dbFolderList.push(dbLevel1Folder);

      const result = core.init(dbList);
      expect(result.childFolderList[0].childFolderList).to.deep.equal(childFolderList);
      idMap.clearMap();
    });
  });

  idMap.clearMap();
});
