import storage from 'src/database/storage';
import Folder from './folder';
import idMap from './idmap';

/* Error Messages */
const ERROR_EMPTY_STRING = 'Attempting to rename file with an empty string';
const ERROR_SAME_FILE_NAME = 'Another file in the current folder has the same name';
const ERROR_MOVING_TO_SAME_FOLDER = 'Attempting to move to current folder';
const ERROR_MOVING_TO_INVALID_FOLDER = 'Attempting to move to an invalid folder';
const ERROR_NOT_FILE_INSTANCE = '"this" is not an instance of "File"';
const ERROR_CONTAIN_ILLEGAL_CHARACTERS = 'New file name contains illegal character(s)';

/* Constant */
const ILLEGAL_CHARACTERS = /^[`~!@#$%^&*()-_=+\\|[\]{};:'",<.>/?]+$/;

/**
* File Object
*
* @param {Number} fileID
* @param {String} fileName
* @param {String} filePath
*/
export default function File(fileID, fileName, filePath, parentFolder) {
  this.id = fileID;
  this.name = fileName;
  this.path = filePath;
  this.parentFolder = parentFolder;
  this.creationDate = null;
  this.lastModifiedDate = null;
}

/* Private Functions */
/**
 * Check if destination folder is current folder this file resides in
 *
 * @param {Folder} destFolder
 * @return {Boolean}
 */
function isCurrentFolder(destFolder) {
  if (!(this instanceof File)) {
    throw new Error(ERROR_NOT_FILE_INSTANCE);
  }
  return destFolder.id === this.parentFolder.id;
}

/**
 * Check if destination folder is null
 *
 * @param {Folder} destFolder
 * @return {Boolean}
 */
function isInvalidFolder(destFolder) {
  return Folder.getFolder(destFolder.id) == null;
}

/**
 * Check if new filename is the same as another filename
 *
 * @param {String} newFileName
 * @return {Boolean}
 */
function hasSameFileName(newFileName) {
  if (!(this instanceof File)) {
    throw new Error(ERROR_NOT_FILE_INSTANCE);
  }
  const currParentFolder = this.parentFolder;
  let currFile;
  let sameFileName = false;
  for (let index = 0; index < currParentFolder.childFileList.length; index += 1) {
    currFile = currParentFolder.childFileList[index];
    /* eslint no-continue:0 */
    if (newFileName === this.name) {
      continue;
    }
    if (newFileName === currFile.name) {
      sameFileName = true;
      break;
    }
  }
  return sameFileName;
}

/**
 * Remove file from the database
 *
 * @return {Promise}
 */
File.prototype.remove = function remove() {
  return storage.deleteFile(this.id)
    .then(() => {
      idMap.removeFileFromMap(this.id);
      const parentFolder = this.parentFolder;
      const index = parentFolder.childFileList.indexOf(this);
      parentFolder.childFileList.splice(index, 1);
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Save data into file
 *
 * @param {String} data
 * @return {}
 */
File.prototype.save = function save(data) {
  return storage.saveFile(this.id, data);
};

/**
 * Load data from file
 *
 * @param {}
 * @return {String} data loaded from file
 */
File.prototype.load = function load() {
  return storage.loadFile(this.id);
};

/**
 * Move file to a specified folder
 *
 * @param {Folder} destFolder
 * @return {Promise}
 */
File.prototype.move = function move(destFolder) {
  return new Promise((resolve, reject) => {
    if (isCurrentFolder.call(this, destFolder)) {
      reject(ERROR_MOVING_TO_SAME_FOLDER);
    }

    if (isInvalidFolder(destFolder)) {
      reject(ERROR_MOVING_TO_INVALID_FOLDER);
    }

    resolve();
  })
  .then(() => storage.moveFile(this.id, destFolder.id))
  .then(() => {
    destFolder.childFileList.push(this);
    const index = this.parentFolder.childFileList.indexOf(this);
    this.parentFolder.childFileList.splice(index, 1);
    this.parentFolder = destFolder;
  });
};

/**
 * Make a copy of a file in the current Folder
 *
 * @return {Promise}
 */
File.prototype.copy = function copy() {
  return storage.copyFile(this.id)
  .then((dbCopiedFile) => {
    const copiedFile = new File(dbCopiedFile.file_id, dbCopiedFile.file_name, dbCopiedFile.file_path, this);
    this.parentFolder.childFileList.push(copiedFile);
    idMap.addFileToMap(copiedFile.id, copiedFile);
  });
};

/**
 * Rename file
 *
 * @param {String} newFileName
 * @return {Promise}
 */
File.prototype.rename = function rename(newFileName) {
  if (!(this instanceof File)) {
    throw new Error(ERROR_NOT_FILE_INSTANCE);
  }

  newFileName = newFileName.trim();
  if (!newFileName) {
    return Promise.reject(new Error(ERROR_EMPTY_STRING));
  } else if (this.name === newFileName) {
    return Promise.resolve();
  } else if (newFileName.match(ILLEGAL_CHARACTERS)) {
    return Promise.reject(new Error(ERROR_CONTAIN_ILLEGAL_CHARACTERS));
  } else if (hasSameFileName.call(this, newFileName)) {
    return Promise.reject(new Error(ERROR_SAME_FILE_NAME));
  } else {
    return storage.renameFile(this.id, newFileName)
    .then(() => {
      const oldFileName = this.name;
      this.name = newFileName;
      this.path = this.path.replace(oldFileName, newFileName);
    });
  }
};

/**
 * Download file
 * (Code transferred from Filemanger.vue)
 *
 * @return {Promise}
 */
File.prototype.download = function download() {
  const data = this.load();
  const element = document.createElement('a');
  const href = 'data:text/plain;charset=utf-8,';
  const content = encodeURIComponent(data);
  element.setAttribute('href', href+content, data);
  const fileName = this.name.concat('.md');
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
