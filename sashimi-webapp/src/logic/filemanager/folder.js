import storage from '../../database/storage';
import File from './file';

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
  console.log('new Folder created');
}

/**
 * Create a new folder in this folder instance
 *
 * @param {String} folderName
 * @return {Folder}
 */
Folder.prototype.createFolder = function createFolder(folderName) {
  console.log('folder.createFolder');
  const newFolderPath = `${this.folderPath}/${folderName}`;
  // const dbFolderObj = storage_api.createFolder(0, newFolderPath, this.id)
  return storage.createFolder(0, newFolderPath, this.id)
  .then((dbFolderObj) => {
    const newFolder = new Folder(dbFolderObj.folder_ID, dbFolderObj.folderName, dbFolderObj.folderPath);
    newFolder.parentFolder = this;
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
Folder.prototype.createFile = function createFile(fileName) {
  console.log('folder.createFile');
  const newFilePath = `${this.folderPath}/${fileName}`;
  return storage.createFile(0, newFilePath, this.id)
  .then((dbFileObj) => {
    const newFile = new File(dbFileObj.file_id, dbFileObj.file_name, dbFileObj.file_path, this);
    this.childFileList.push(newFile);
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
  console.log('folder.remove');
  return storage.deleteFolder(this.id)
  .then(() => {
    const parentFolder = this.parentFolder;
    const index = parentFolder.childFolderList.findIndex(childFolder => childFolder.id === this.id);
    parentFolder.childFolderList.splice(index, 1);
  })
  .catch((error) => {
    throw error;
  });
};

/**
 * Rename the folder in the database
 *
 * @param {String} newFolderName
 * @return {}
 */
Folder.prototype.rename = function rename(newFolderName) {
  console.log('folder.next');
  this.folderName = newFolderName;
  // update folder name in database
};

/* Private Functions */
function queueIsEmpty(queue) {
  return queue.length <= 0;
}

function removeElementAtIndex(queue, index) {
  if (index === -1) {
    return null;
  } else {
    return queue.splice(index, 1);
  }
}

function getChildFile(queue, parentID) {
  parentID = parentID || -1; // -1 = no parentID (only root has no parent)
  const index = queue.findIndex(dbFileObj => dbFileObj.folder_ID === parentID);
  return removeElementAtIndex(queue, index);
}

function getChildFolder(queue, parentID) {
  parentID = parentID || -1; // -1 = no parentID (only root has no parent)
  const index = queue.findIndex(dbFolderObj => dbFolderObj.parent_folder_ID === parentID);
  return removeElementAtIndex(queue, index);
}

/* Folder static function */
const folderOperation = {
  /**
   * Returns the root folder
   *
   * @return {Folder}
   */
  getRootFolder: function getRootFolder() {
    console.log('folderOperation.getRootFolder');
    // to be changed when online platform is implemented

    return storage.initializeDatabase()
    .then(() => storage.loadAllFilesAndFolders()
      .then((dbList) => {
        const dbFileList = dbList.shift(); // list of File from database list
        const dbFolderList = dbList.shift(); // list of Folder from datbase list

        const processingQueue = [];
        const rootFolder = getChildFolder(dbFolderList);
        processingQueue.push(new Folder(rootFolder.folder_ID, rootFolder.folder_name, rootFolder.folder_path));

        let currFolder;
        let dbFileObj;
        let dbFolderObj;
        let childFile;
        let childFolder;
        while (!queueIsEmpty(processingQueue)) {
          currFolder = processingQueue.shift();

      /* Process dbFileList for child file */
          while ((dbFileObj = getChildFile(dbFileList, currFolder.id)) !== null) {
            childFile = new File(dbFileObj.file_ID, dbFileObj.file_name, dbFileObj.file_path);
            currFolder.childFileList.push(childFile);
          }

      /* Process dbFolderList for child folder */
          while ((dbFolderObj = getChildFolder(dbFolderList, currFolder.id)) !== null) {
            processingQueue.push(dbFolderObj);
            childFolder = new Folder(dbFolderObj.folder_ID, dbFolderObj.folder_name, dbFolderObj.folder_path);
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
  }

};

export default folderOperation;
