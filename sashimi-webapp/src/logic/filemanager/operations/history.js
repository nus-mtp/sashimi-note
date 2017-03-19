import Folder from '../data/folder';

/* Error Messages */
const ERROR_NOT_FOLDER = 'Input is not an instance of Folder';
const ERROR_SAME_FOLDER = 'Attempting to update the same folder';

/* Private Function */
/**
 * Check if object is a File
 *
 * @param {any} obj
 * @return {boolean}
 */
function isFolder(obj) {
  return obj instanceof Folder;
}

/**
 * Check if folder is the same
 *
 * @param {Folder} folder1
 * @param {Folder} folder2
 * @return {boolean}
 */
function isSameFolder(folder1, folder2) {
  return folder1 === folder2;
}

/**
 * History Object
 *
 * @param {Folder} folder
 */
export default function History(folder) {
  if (!isFolder(folder)) {
    throw new Error(ERROR_NOT_FOLDER);
  }
  this.currFolder = folder;
  this.previousHistory = [];
  this.nextHistory = [];
}

/**
* Update the current Folder
*
* @param {Folder} newFolder
* @return {Folder}
*/
History.prototype.update = function update(newFolder) {
  if (!isFolder(newFolder)) {
    throw new Error(ERROR_NOT_FOLDER);
  }
  if (isSameFolder(newFolder, this.currFolder)) {
    throw new Error(ERROR_SAME_FOLDER);
  }
  this.previousHistory.push(this.currFolder);
  this.nextHistory = [];
  this.currFolder = newFolder;
  return this.currFolder;
};

/**
* Return the most recently updated Folder
*
* @return {Folder}
*/
History.prototype.previous = function previous() {
  if (this.previousHistory.length > 0) {
    this.nextHistory.push(this.currFolder);
    this.currFolder = this.previousHistory.pop();
  }
  return this.currFolder;
};

/**
* Return the Folder before previous was called
*
* @return {Folder}
*/
History.prototype.next = function next() {
  if (this.nextHistory.length > 0) {
    this.previousHistory.push(this.currFolder);
    this.currFolder = this.nextHistory.pop();
  }
  return this.currFolder;
};
