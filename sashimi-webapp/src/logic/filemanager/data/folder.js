import storage from 'src/database/storage';
import File from './file';
import idMap from './idmap';

/* Error Messages */
const ERROR_EMPTY_STRING = 'Attempting to rename folder with an empty string';
const ERROR_SAME_FOLDER_NAME = 'Another folder in the current folder has the same name';
const ERROR_RENAME_ROOTFOLDER = 'Root folder cannot be renamed';
const ERROR_REMOVE_ROOTFOLDER = 'Root folder cannot be removed';
const ERROR_NOT_FOLDER_INSTANCE = '"this" is not an instance of "Folder"';
const ERROR_CONTAIN_ILLEGAL_CHARACTERS = 'New folder name contains illegal character(s)';

/* Constants */
const ORGANIZATION_ID = 1;
const ROOT_FOLDER_ID = 0;
const ILLEGAL_CHARACTERS = '!$%^&*()_+|~-=`{}[]:";\'<>?,./';

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

/* Private Function */
/**
 * Check if new foldername is the same as another foldername
 *
 * @param {String} newFolderName
 * @return {Boolean}
 */
function hasSameFolderName(newFolderName) {
  if (!(this instanceof Folder)) {
    throw new Error(ERROR_NOT_FOLDER_INSTANCE);
  }
  const currParentFolder = this.parentFolder;
  let currFolder;
  let sameFolderName = false;
  for (let index = 0; index < currParentFolder.childFolderList.length; index += 1) {
    currFolder = currParentFolder.childFolderList[index];
    /* eslint no-continue:0 */
    if (newFolderName === this.name) {
      continue;
    }
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
 * @return {Promise}
 */
Folder.prototype.remove = function remove() {
  if (this.id === ROOT_FOLDER_ID) {
    throw new Error(ERROR_REMOVE_ROOTFOLDER);
  }
  return storage.deleteFolder(this.id)
  .then(() => {
    idMap.removeFolderFromMap(this.id);
    const parentFolder = this.parentFolder;
    const index = parentFolder.childFolderList.indexOf(this);
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
  if (!(this instanceof Folder)) {
    throw new Error(ERROR_NOT_FOLDER_INSTANCE);
  }

  newFolderName = newFolderName.trim();
  if (!newFolderName) {
    return new Promise((resolve, reject) => reject(ERROR_EMPTY_STRING));
  } else if (this.name === newFolderName) {
    return new Promise((resolve, reject) => resolve());
  /* }  else if (newFolderName.match(ILLEGAL_CHARACTERS)) {
    return new Promise((resolve, reject) => reject(ERROR_CONTAIN_ILLEGAL_CHARACTERS));*/
  } else if (this.id === ROOT_FOLDER_ID) {
    return new Promise((resolve, reject) => reject(ERROR_RENAME_ROOTFOLDER));
  } else if (hasSameFolderName.call(this, newFolderName)) {
    return new Promise((resolve, reject) => reject(ERROR_SAME_FOLDER_NAME));
  } else {
    return storage.renameFolder(this.id, newFolderName)
    .then(() => {
      const oldFolderName = this.name;
      this.name = newFolderName;
      this.path = this.path.replace(oldFolderName, newFolderName);
    });
  }
};
