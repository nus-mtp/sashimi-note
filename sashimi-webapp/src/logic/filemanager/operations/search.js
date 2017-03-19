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
 */
function searchDB(searchString) {
  storage.partialSearch(searchString)
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
        searchFileList.push(idMap.getFolderFromMap(dbFolderObj.folder_id));
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
   * @return {Folder}
   */
  fileOnly: function fileOnly(searchString) {
    searchDB(searchString);
    searchFolder.childFileList = searchFileList;
    return searchFolder;
  },

  /**
   * Return a Search Folder which contain list of folders found
   *
   * @param {String} searchString
   * @return {Folder}
   */
  folderOnly: function folderOnly(searchString) {
    searchDB(searchString);
    searchFolder.childFolderList = searchFolderList;
    return searchFolder;
  },

  /**
   * Return a Search Folder which contain list of files and folders found
   *
   * @param {String} searchString
   * @return {Folder}
   */
  all: function all(searchString) {
    searchDB(searchString);
    searchFolder.childFileList = searchFileList;
    searchFolder.childFolderList = searchFolderList;
    return searchFolder;
  }

};

export default search;
