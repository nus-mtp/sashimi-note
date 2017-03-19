import File from './file';
import Folder from './folder';

/* Error Messages */
const ERROR_NOT_ID = 'Input is not an ID';
const ERROR_NOT_FILE = 'Input is not a File';
const ERROR_NOT_FOLDER = 'Input is not a Folder';

/* Constants */
const fileMap = {}; // key: fileID, value: File
const folderMap = {}; // key: folderID, value: Folder

/* Private Functions */
/**
 * Check if ID is a Number
 *
 * @param {any} id
 * @return {boolean}
 */
function isID(id) {
  return Number.isInteger(id);
}

/**
 * Check if object is a File
 *
 * @param {any} obj
 * @return {boolean}
 */
function isFile(obj) {
  return obj instanceof File;
}

/**
 * Check if object is a Folder
 *
 * @param {any} obj
 * @return {boolean}
 */
function isFolder(obj) {
  return obj instanceof Folder;
}


const idMap = {
  /* Add Operations */
  /**
   * Add a new File to fileMap
   *
   * @param {Number} fileID
   * @param {Folder} fileObj
   */
  addFileToMap: function addFileToMap(fileID, fileObj) {
    if (!isID(fileID)) {
      throw new Error(ERROR_NOT_ID);
    }
    if (!isFile(fileObj)) {
      throw new Error(ERROR_NOT_FILE);
    }
    fileMap[fileID] = fileObj;
  },

  /**
   * Add a new Folder to folderMap
   *
   * @param {Number} folderID
   * @param {Folder} folderObj
   */
  addFolderToMap: function addFolderToMap(folderID, folderObj) {
    if (!isID(folderID)) {
      throw new Error(ERROR_NOT_ID);
    }
    if (!isFolder(folderObj)) {
      throw new Error(ERROR_NOT_FOLDER);
    }
    folderMap[folderID] = folderObj;
  },

  /* Get Operations */
  /**
   * Get a File from fileMap
   *
   * @param {Number} fileID
   * @return {File}
   */
  getFileFromMap: function getFileFromMap(fileID) {
    if (!isID(fileID)) {
      throw new Error(ERROR_NOT_ID);
    }
    return fileMap[fileID];
  },

  /**
   * Get a Folder from folderMap
   *
   * @param {Number} folderID
   * @return {Folder}
   */
  getFolderFromMap: function getFolderFromMap(folderID) {
    if (!isID(folderID)) {
      throw new Error(ERROR_NOT_ID);
    }
    return folderMap[folderID];
  },

  /* Remove Operations */
  /**
   * Remove a File from fileMap
   *
   * @param {Number} fileID
   */
  removeFileFromMap: function removeFileFromMap(fileID) {
    if (!isID(fileID)) {
      throw new Error(ERROR_NOT_ID);
    }
    delete fileMap[fileID];
  },

  /**
   * Remove a Folder from folderMap
   *
   * @param {Number} folderID
   */
  removeFolderFromMap: function removeFolderFromMap(folderID) {
    if (!isID(folderID)) {
      throw new Error(ERROR_NOT_ID);
    }
    delete folderMap[folderID];
  }
};

export default idMap;
