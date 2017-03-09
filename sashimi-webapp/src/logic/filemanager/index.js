import Folder from './folder';
import history from './history';
import search from './search';

const fileManager = {

  /** Initialize database
   *
   * @return {Folder} root folder
   */
  start: function start() {
    return Folder.getRootFolder();
  },

  /* Search Operations */

  /**
   * Return a list of files and folders containing the search string
   *
   * @param {String} searchString
   * @return {List} Contains files and folders
   */
  searchAll: function searchAll(searchString) {
    // return search.all(searchString)
  },

  searchFileOnly: function searchFileOnly(searchString) {
    // return search.fileOnly(searchString)
  },

  searchFolderOnly: function searchFolderOnly(searchString) {
    // return search.folderOnly(searchString)
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

// module.exports = fileManager;
export default fileManager;
