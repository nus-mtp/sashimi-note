import Folder from './folder';
import history from './history';
import search from './search';

const fileManager = {

  /**
   * Initialize Filemanager and Database
   *
   * @return {Promise}
   */
  start: function start() {
    return Folder.init();
  },

  /* Get Operations */

  /**
   * Given an ID, return the File
   *
   * @param {Integer} fileID
   * @return {File}
   */
  getFileByID: function getFileByID(fileID) {
    return Folder.getFile(fileID);
  },

  /**
   * Given an ID, return the Folder
   *
   * @param {Integer} folderID
   * @return {Folder}
   */
  getFolderByID: function getFolderByID(folderID) {
    return Folder.getFolder(folderID);
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

  /**
   * Return a Folder containing folders matching the search string
   *
   * @param {String} searchString
   * @return {Folder}
   */
  searchFolderOnly: function searchFolderOnly(searchString) {
    return search.folderOnly(searchString);
  },

  /* History Operations */

  update: function update(folder) {
    return history.update(folder);
  },

  previous: function previous() {
    return history.previous();
  },

  next: function next() {
    return history.next();
  }

};

export default fileManager;
