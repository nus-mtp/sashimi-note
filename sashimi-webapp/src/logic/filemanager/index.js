import core from './operations/core';
import search from './operations/search';
import History from './operations/history';

const fileManager = {

  /**
   * Initialize Filemanager
   *
   * @return {Promise}
   */
  start: function start() {
    return core.loadDB()
      .then(core.init);
  },

  /* Get Operations */

  /**
   * Given an ID, return the File
   *
   * @param {Integer} fileID
   * @return {File}
   */
  getFileByID: function getFileByID(fileID) {
    return core.getFile(fileID);
  },

  /**
   * Given an ID, return the Folder
   *
   * @param {Integer} folderID
   * @return {Folder}
   */
  getFolderByID: function getFolderByID(folderID) {
    return core.getFolder(folderID);
  },

  /* Search Operations */

  /**
   * Return a Folder containing files and folders matching the search string
   *
   * @param {String} searchString
   * @return {Folder}
   */
  searchAll: function searchAll(searchString) {
    return search.all(searchString);
  },

  /**
   * Return a Folder containing files matching the search string
   *
   * @param {String} searchString
   * @return {Folder}
   */
  searchFileOnly: function searchFileOnly(searchString) {
    return search.fileOnly(searchString);
  },

  /** `
   * Return a Folder containing folders matching the search string
   *
   * @param {String} searchString
   * @return {Folder}
   */
  searchFolderOnly: function searchFolderOnly(searchString) {
    return search.folderOnly(searchString);
  },

  /* History Operation */

  /**
   * Return a History with the current folder initialized as the given folder.
   *
   * @param {Folder} folder
   * @return {History}
   */
  createHistory: function createHistory(folder) {
    return new History(folder);
  }

};

export default fileManager;
