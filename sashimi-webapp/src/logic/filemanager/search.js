import storage from 'src/database/storage';
import Folder from './folder';

const searchFolder = Folder.createEmptyFolder();
let searchFileList = [];
let searchFolderList = [];

function searchDB(searchString) {
  storage.partialSearch(searchString)
    .then((dbList) => {
      const dbFileList = dbList.shift();
      const dbFolderList = dbList.shift();

      let dbFileObj;
      let dbFolderObj;
      searchFileList = [];
      searchFolderList = [];

      while ((dbFileObj = dbFileList.shift()) !== null) {
        searchFileList.push(Folder.get(dbFileObj.file_id));
      }

      while ((dbFolderObj = dbFolderList.shift()) !== null) {
        searchFileList.push(Folder.get(dbFolderObj.folder_id));
      }
    })
    .catch((error) => {
      throw error;
    });
}


const search = {

  fileOnly: function fileOnly(searchString) {
    searchDB(searchString);
    searchFolder.childFileList = searchFileList;
    return searchFolder;
  },

  folderOnly: function folderOnly(searchString) {
    searchDB(searchString);
    searchFolder.childFolderList = searchFolderList;
    return searchFolder;
  },

  all: function all(searchString) {
    searchDB(searchString);
    searchFolder.childFileList = searchFileList;
    searchFolder.childFolderList = searchFolderList;
    return searchFolder;
  }

};

export default search;
