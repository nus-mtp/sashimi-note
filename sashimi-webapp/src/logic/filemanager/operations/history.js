import Folder from '../data/folder';
import idMap from '../data/idmap';

/* Error Messages */
const ERROR_NOT_FOLDER = 'Input is not an instance of Folder';
const ERROR_FOLDER_NOT_FOUND = 'Folder not found';
const ERROR_SAME_FOLDER = 'Attempting to update the same folder';
const ERROR_FOLDER_NO_LONGER_EXIST = 'Folder no longer exist';

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
 * @param {Integer} folderID1
 * @param {Integer} folderID2
 * @return {boolean}
 */
function isSameFolder(folderID1, folderID2) {
  return folderID1 === folderID2;
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
  this.currFolderID = folder.id;
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
  if (idMap.getFolderFromMap(newFolder.id) == null) {
    throw new Error(ERROR_FOLDER_NOT_FOUND);
  }
  if (isSameFolder(newFolder.id, this.currFolderID)) {
    throw new Error(ERROR_SAME_FOLDER);
  }
  this.previousHistory.push(this.currFolderID);
  this.nextHistory = [];
  this.currFolderID = newFolder.id;
  return idMap.getFolderFromMap(this.currFolderID);
};

/**
* Return the most recently updated Folder
*
* @return {Folder}
*/
History.prototype.previous = function previous() {
  if (this.previousHistory.length > 0) {
    const tempFolderID = this.previousHistory.pop();
    if (idMap.getFolderFromMap(tempFolderID) == null) {
      this.previousHistory = [];
      this.nextHistory = [];
      throw new Error(ERROR_FOLDER_NO_LONGER_EXIST);
    } else {
      this.nextHistory.push(this.currFolderID);
      this.currFolderID = tempFolderID;
    }
  }
  return idMap.getFolderFromMap(this.currFolderID);
};

/**
* Return the Folder before previous was called
*
* @return {Folder}
*/
History.prototype.next = function next() {
  if (this.nextHistory.length > 0) {
    const tempFolderID = this.nextHistory.pop();
    if (idMap.getFolderFromMap(tempFolderID) == null) {
      this.nextHistory = [];
      throw new Error(ERROR_FOLDER_NO_LONGER_EXIST);
    } else {
      this.previousHistory.push(this.currFolderID);
      this.currFolderID = tempFolderID;
    }
  }
  return idMap.getFolderFromMap(this.currFolderID);
};
