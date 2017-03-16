import storage from 'src/database/storage';
import File from './file';

/* Constants */
const ORGANIZATION_ID = 0;
const ROOT_FOLDER_ID = 0;
const NO_PARENT_ID = -1;

const idtoFileMap = {}; // key: id, value: File
const idtoFolderMap = {}; // key: id, value: Folder

/**
* Folder Object
*
* @param {Number} folderID
* @param {String} folderName
* @param {String} folderPath
*/

function Folder(folderID, folderName, folderPath) {
  this.id = folderID;
  this.name = folderName;
  this.path = folderPath;
  this.parentFolder = null;
  this.childFolderList = []; // list of folders in current folder
  this.childFileList = []; // list of files in current folder
}

/**
 * Create a new folder in this folder instance
 *
 * @param {String} folderName
 * @return {Folder}
 */
Folder.prototype.createFolder = function createFolder() {
  return storage.createFolder(ORGANIZATION_ID, this.path, this.id)
  .then((dbFolderObj) => {
    const newFolder = new Folder(dbFolderObj.folder_id, dbFolderObj.folder_name, dbFolderObj.folder_path);
    newFolder.parentFolder = this;
    idtoFolderMap[newFolder.id] = newFolder;
    this.childFolderList.push(newFolder);
    return newFolder;
  })
  .catch((error) => {
    throw error;
  });
};

/**
 * Create a new file in this folder in this folder instance
 *
 * @param {String} fileName
 * @return {File}
 */
Folder.prototype.createFile = function createFile() {
  return storage.createFile(ORGANIZATION_ID, this.path, this.id)
  .then((dbFileObj) => {
    const newFile = new File(dbFileObj.file_id, dbFileObj.file_name, dbFileObj.file_path, this);
    idtoFileMap[newFile.id] = newFile;
    this.childFileList.push(newFile);
    return newFile;
  })
  .catch((error) => {
    throw error;
  });
};

/**
 * Remove a folder from the database
 *
 * @param {}
 * @return {}
 */
Folder.prototype.remove = function remove() {
  if (this.id === ROOT_FOLDER_ID) {
    throw new Error('Cannot remove root folder.');
  }
  return storage.deleteFolder(this.id)
  .then(() => {
    const parentFolder = this.parentFolder;
    const index = parentFolder.childFolderList.findIndex(childFolder => childFolder.id === this.id);
    parentFolder.childFolderList.splice(index, 1);
  });
};

/**
 * Rename the folder in the database
 *
 * @param {String} newFolderName
 * @return {}
 */
Folder.prototype.rename = function rename(newFolderName) {
  // storage.renameFolder(newFolderName, this.id);
  const oldFolderName = this.name;
  this.name = newFolderName;
  this.path = this.path.replace(oldFolderName, newFolderName);

  // update folder name in database
};

/* Private Functions */
function queueIsEmpty(queue) {
  return queue.length <= 0;
}

function removeElementAtIndex(queue, index) {
  if (index === NO_PARENT_ID) {
    return null;
  } else {
    return queue.splice(index, 1)[0];
  }
}

function getChildFile(queue, parentID) {
  parentID = (parentID == null) ? NO_PARENT_ID: parentID;
  const index = queue.findIndex(dbFileObj => dbFileObj.folder_id === parentID);
  return removeElementAtIndex(queue, index);
}

function getChildFolder(queue, parentID) {
  parentID = (parentID == null) ? NO_PARENT_ID: parentID;
  const index = queue.findIndex(dbFolderObj => dbFolderObj.parent_folder_id === parentID);
  return removeElementAtIndex(queue, index);
}

/* Folder static functions */
const folderOperation = {
  /**
   * Initialize database and all files and folders
   *
   * @return {Promise}
   */
  init: function init() {
    // to be changed when online platform is implemented

    return storage.initializeDatabase()
    .then(() => storage.loadAllFilesAndFolders()
      .then((dbList) => {
        const dbFileList = dbList.shift(); // list of File from database list
        const dbFolderList = dbList.shift(); // list of Folder from datbase list

        const processingQueue = [];
        const dbRootFolderObj = getChildFolder(dbFolderList);
        const rootFolder = new Folder(dbRootFolderObj.folder_id, dbRootFolderObj.folder_name, dbRootFolderObj.folder_path || '');
        processingQueue.push(rootFolder);
        idtoFolderMap[rootFolder.id] = rootFolder;

        let currFolder;
        let dbFileObj;
        let dbFolderObj;
        let childFile;
        let childFolder;
        while (!queueIsEmpty(processingQueue)) {
          currFolder = processingQueue.shift();

      /* Process dbFileList for child file */
          while ((dbFileObj = getChildFile(dbFileList, currFolder.id)) !== null) {
            childFile = new File(dbFileObj.file_id, dbFileObj.file_name, dbFileObj.file_path);
            idtoFileMap[childFile.id] = childFile;
            currFolder.childFileList.push(childFile);
          }

      /* Process dbFolderList for child folder */
          while ((dbFolderObj = getChildFolder(dbFolderList, currFolder.id)) !== null) {
            processingQueue.push(dbFolderObj);
            childFolder = new Folder(dbFolderObj.folder_id, dbFolderObj.folder_name, dbFolderObj.folder_path);
            idtoFolderMap[childFolder.id] = childFolder;
            childFolder.parentFolder = currFolder;
            currFolder.childFolderList.push(childFolder);
          }
        }
        return rootFolder;
      })
      .catch((error) => {
        throw error;
      }))
    .catch((error) => {
      throw error;
    });
  },

  getFile: function getFile(id) {
    return idtoFileMap[id];
  },

  getFolder: function getFolder(id) {
    return idtoFolderMap[id];
  }

};

export default folderOperation;
