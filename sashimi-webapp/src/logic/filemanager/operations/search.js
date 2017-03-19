import storage from 'src/database/storage';
import idMap from '../data/idmap';
import Folder from '../data/folder';

/* Static Variables */
const searchFolder = new Folder();
let searchFileList = [];
let searchFolderList = [];

/* Private Function */
/**
 * Searches database for filenames and foldernames containing the search string
 *
 * @param {String} searchString
 * @return {Promise}
 */
function searchDB(searchString) {
  return storage.partialSearch(searchString)
    .then((dbList) => {
      const dbFileList = dbList.shift();
      const dbFolderList = dbList.shift();

      let dbFileObj;
      let dbFolderObj;
      searchFileList = [];
      searchFolderList = [];

      while ((dbFileObj = dbFileList.shift()) != null) {
        searchFileList.push(idMap.getFileFromMap(dbFileObj.file_id));
      }

      while ((dbFolderObj = dbFolderList.shift()) != null) {
        searchFolderList.push(idMap.getFolderFromMap(dbFolderObj.folder_id));
      }
    })
    .catch((error) => {
      throw error;
    });
}


const search = {

  /**
   * Return a Search Folder which contain list of files found
   *
   * @param {String} searchString
   * @return {Promise<Folder>}
   */
  fileOnly: function fileOnly(searchString) {
    return searchDB(searchString)
    .then(() => {
      searchFolder.childFileList = searchFileList;
      return searchFolder;
    });
  },

  /**
   * Return a Search Folder which contain list of folders found
   *
   * @param {String} searchString
   * @return {Promise<Folder>}
   */
  folderOnly: function folderOnly(searchString) {
    return searchDB(searchString)
    .then(() => {
      searchFolder.childFolderList = searchFolderList;
      return searchFolder;
    });
  },

  /**
   * Return a Search Folder which contain list of files and folders found
   *
   * @param {String} searchString
   * @return {Promise<Folder>}
   */
  all: function all(searchString) {
    return searchDB(searchString)
    .then(() => {
      searchFolder.childFileList = searchFileList;
      searchFolder.childFolderList = searchFolderList;
      return searchFolder;
    });
  }

};

export default search;
