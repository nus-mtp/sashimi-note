const folderOperation = {

  /**
  * Create a new folder in the database
  *
  * @param {String} folderName
  * @param {Folder} folder
  * @return {}
  */
  createFolder: function createFolder(fileName, folder) {
    console.log('folderOperation.createFolder');
  },

  /**
  * Delete a folder from the database
  *
  * @param {Folder} folder
  * @return {}
  */
  deleteFolder: function deleteFolder(folder) {
    console.log('folderOperation.deleteFolder');
  },

  /**
  * Open a folder in the database.
  *
  * @param {Folder} folder
  * @return {}
  */
  openFolder: function openFolder(folder) {
    console.log('folderOperation.openFolder');
  },

  /**
  * Open the previous folder.
  *
  * @return {}
  */
  previousFolder: function previousFolder(folder) {
    console.log('folderOperation.previousFolder');
  },

  /**
  * Open the next folder.
  *
  * @return {}
  */
  nextFolder: function nextFolder(folder) {
    console.log('folderOperation.nextFolder');
  },

  /**
  * Rename a folder in the database.
  *
  * @param {String} newFolderName
  * @param {Folder} folder
  * @return {}
  */
  renameFolder: function renameFolder(folder) {
    console.log('folderOperation.renameFolder');
  },

};

module.exports = folderOperation;
