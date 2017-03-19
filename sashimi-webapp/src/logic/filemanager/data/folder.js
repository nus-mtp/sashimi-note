import storage from 'src/database/storage';
import File from './file';
import idMap from './idmap';

/* Error Messages */
const ERROR_SAME_FOLDER_NAME = 'Another folder in the current folder has the same name';
const ERROR_RENAME_ROOTFOLDER = 'Root folder cannot be renamed';
const ERROR_NOT_FOLDER_INSTANCE = '"this" is not an instance of "Folder"';

/* Constants */
const ORGANIZATION_ID = 1;
const ROOT_FOLDER_ID = 0;

/**
* Folder Object
*
* @param {Number} folderID
* @param {String} folderName
* @param {String} folderPath
*/
export default function Folder(folderID, folderName, folderPath) {
  this.id = folderID;
  this.name = folderName;
  this.path = folderPath;
  this.parentFolder = null;
  this.childFolderList = []; // list of folders in current folder
  this.childFileList = []; // list of files in current folder
}

/* Private Functions */
function hasSameFolderName(newFolderName) {
  if (!(this instanceof Folder)) {
    throw new Error(ERROR_NOT_FOLDER_INSTANCE);
  }
  const currParentFolder = this.parentFolder;
  let currFolder;
  let sameFolderName = false;
  for (let i = 0; currParentFolder.childFolderList.length; i += 1) {
    currFolder = currParentFolder.childFolderList[i];
    if (newFolderName === currFolder.name) {
      sameFolderName = true;
      break;
    }
  }
  return sameFolderName;
}

/**
 * Create a new folder in this folder instance
 *
 * @param {}
 * @return {Folder}
 */
Folder.prototype.createFolder = function createFolder() {
  return storage.createFolder(ORGANIZATION_ID, this.path, this.id)
  .then((dbFolderObj) => {
    const newFolder = new Folder(dbFolderObj.folder_id, dbFolderObj.folder_name, dbFolderObj.folder_path);
    newFolder.parentFolder = this;
    idMap.addFolderToMap(newFolder.id, newFolder);
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
 * @param {}
 * @return {File}
 */
Folder.prototype.createFile = function createFile() {
  return storage.createFile(ORGANIZATION_ID, this.path, this.id)
  .then((dbFileObj) => {
    const newFile = new File(dbFileObj.file_id, dbFileObj.file_name, dbFileObj.file_path, this);
    idMap.addFileToMap(newFile.id, newFile);
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
    idMap.removeFolderFromMap(this.id);
    const parentFolder = this.parentFolder;
    const index = parentFolder.childFolderList.findIndex(childFolder => childFolder.id === this.id);
    parentFolder.childFolderList.splice(index, 1);
  });
};

/**
 * Rename folder
 *
 * @param {String} newFolderName
 * @return {Promise}
 */
Folder.prototype.rename = function rename(newFolderName) {
  return new Promise((resolve, reject) => {
    if (this.id === ROOT_FOLDER_ID) {
      reject(ERROR_RENAME_ROOTFOLDER);
    }
    if (hasSameFolderName.call(this, newFolderName)) {
      reject(ERROR_SAME_FOLDER_NAME);
    }
    resolve();
  })
  .then(() => storage.renameFolder(newFolderName, this.id))
  .then(() => {
    const oldFolderName = this.name;
    this.name = newFolderName;
    this.path = this.path.replace(oldFolderName, newFolderName);
  });
};
