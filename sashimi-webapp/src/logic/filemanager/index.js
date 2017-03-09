import Folder from './folder';
import history from './history';

const fileManager = {

  /** Initialize database
   *
   * @return {Folder} root folder
   */
  start: function start() {
    return Folder.getRootFolder();
  },

  /* Search Operation */
  /**
   * Return a list of files and folders containing the search string
   *
   * @param {String} searchString
   * @return {List} Contains files and folders
   */
  search: function search(searchString) {
    // return storage.partialSearch(searchString)
  },

  /* History Operation */

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
