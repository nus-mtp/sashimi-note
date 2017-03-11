import storage from '../../database/storage';
import Folder from './folder';

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
  console.log('new File created');
}

/**
 * Remove file from the database
 *
 * @param {}
 * @return {}
 */
File.prototype.remove = function remove() {
  console.log('file.remove');
  // Case 1a: file exist, file removed
  // Case 1b: file exist, file not removed (error)
  // Case 2: file does not exist (nothing removed)

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
  console.log('file.save');
  // Case 1a: file exist, file saved
  // Case 1b: file exist, file not saved (error)
  // Case 2: file does not exist (nothing saved)

  return storage.saveFile(this.id, data);
};

/**
 * Load data from file
 *
 * @param {}
 * @return {String} data loaded from file
 */
File.prototype.load = function load() {
  console.log('file.load');
  // Case 1a: file exist, file loaded
  // Case 1b: file exist, file not loaded (error)
  // Case 2: file does not exist (nothing loaded)

  return storage.loadFile(this.id);
};

/**
 * Copy file
 *
 * @param {Folder} folder default: currentFolder
 * @return {}
 */
File.prototype.copy = function copy(folder) {
  console.log('file.copy');
  // Case 1a: file exist, valid folder, file copied
  // Case 1b: file exist, invalid folder, file not copied (error)
  // Case 2: file does not exist (not copied)
  // Case 3: file exist, folder not specified, default: current folder used
};

/**
 * Move file to a specified folder
 *
 * @param {Folder} folder
 * @return {}
 */
File.prototype.move = function move() {
  console.log('file.move');
  // Changing file path
  // Case 1a: file exist, valid folder, file moved
  // Case 1b: file exist, invalid folder, file not moved (error)
  // Case 1c: file exist, folder is where file currently reside in (not moved)
  // Case 2: file does not exist (not moved)
};

/**
 * Download file from database to drive
 *
 * @param {String} fileFormat deafult: md format
 * @return {}
 */
File.prototype.download = function download() {
  console.log('file.download');
};

/**
 * Upload file from drive to database
 *
 * @param {}
 * @return {}
 */
File.prototype.upload = function upload() {
  console.log('file.upload');
};

/**
 * Rename file
 *
 * @param {String} newFileName
 * @return {}
 */
File.prototype.rename = function rename(newFileName) {
  console.log('file.rename');
  this.fileName = newFileName;
  // update database
};
