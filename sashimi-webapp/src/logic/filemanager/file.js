import storage from 'src/database/storage';

/* Constants */

const RENAME_ERROR_MSG = `Another file in ${this.parentFolder.path} has the same file name`;

/* Private Functions */
function hasSameFileName(newFileName) {
  const currFolder = this.parentFolder;
  let currFile;
  let sameFileName = false;
  for (let i = 0; i< currFolder.childFileList.length; i += 1) {
    currFile = currFolder.childFileList[i];
    if (newFileName === currFile.fileName) {
      sameFileName = true;
      break;
    }
  }
  return sameFileName;
}

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
}

/**
 * Remove file from the database
 *
 * @param {}
 * @return {}
 */
File.prototype.remove = function remove() {
  return storage.deleteFile(this.path)
    .then(() => {
      const parentFolder = this.parentFolder;
      const index = parentFolder.childFileList.findIndex(childFile => childFile.id === this.id);
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
 * Copy file
 *
 * @param {Folder} folder default: currentFolder
 * @return {}
 */
File.prototype.copy = function copy(folder) {

};

/**
 * Move file to a specified folder
 *
 * @param {Folder} folder
 * @return {}
 */
File.prototype.move = function move() {

};

/**
 * Rename file
 *
 * @param {String} newFileName
 * @return {Promise}
 */
File.prototype.rename = function rename(newFileName) {
  return new Promise((resolve, reject) => {
    if (hasSameFileName(newFileName)) {
      reject(RENAME_ERROR_MSG);
    }

    resolve();
  })
  .then(() => storage.renameFile(newFileName, this.id))
  .then(() => {
    const oldFileName = this.name;
    this.name = newFileName;
    this.path = this.path.replace(oldFileName, newFileName);
  });
};


/**
 * Download file from database to drive
 *
 * @param {String} fileFormat deafult: md format
 * @return {}

File.prototype.download = function download() {

};

/**
 * Upload file from drive to database
 *
 * @param {}
 * @return {}

File.prototype.upload = function upload() {

};

*/
