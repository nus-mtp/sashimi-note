const fileOperation = {

  /**
  * Create a new file in the database
  *
  * @param {String} fileName
  * @param {Folder} folder
  * @return {}
  */
  createFile: function createFile(fileName, folder) {
    console.log('fileOperation.createFile');
  },

  /**
  * Delete an existing file in the database
  *
  * @param {File} file
  * @return {}
  */
  deleteFile: function deleteFile(file) {
    console.log('fileOperation.deleteFile');
    // Case 1a: file exist, file deleted
    // Case 1b: file exist, file not deleted (error)
    // Case 2: file does not exist (nothing deleted)
  },

  /**
  * Save data into an existing file
  *
  * @param {File} file
  * @param {String} data
  * @return {}
  */
  saveFile: function saveFile(file, data) {
    console.log('fileOperation.saveFile');
    // Case 1a: file exist, file saved
    // Case 1b: file exist, file not saved (error)
    // Case 2: file does not exist (nothing saved)
  },

  /**
  * Load data from an existing file
  *
  * @param {File} file
  * @return {String} data loaded from specified file
  */
  loadFile: function loadFile(file) {
    console.log('fileOperation.loadFile');
    // Case 1a: file exist, file loaded
    // Case 1b: file exist, file not loaded (error)
    // Case 2: file does not exist (nothing loaded)
  },

  /**
  * Copy an existing file
  *
  * @param {File} file
  * @param {Folder} folder default: currentFolder
  * @return {}
  */
  copyFile: function copyFile(file, folder) {
    console.log('fileOperation.copyFile');
    // Case 1a: file exist, valid folder, file copied
    // Case 1b: file exist, invalid folder, file not copied (error)
    // Case 2: file does not exist (not copied)
    // Case 3: file exist, folder not specified, default: current folder used
  },

 /**
  * Move an existing file to a specified folder
  *
  * @param {File} file
  * @param {Folder} folder
  * @return {}
  */
  moveFile: function moveFile(file, folder) {
    console.log('fileOperation.moveFile');
    // Case 1a: file exist, valid folder, file moved
    // Case 1b: file exist, invalid folder, file not moved (error)
    // Case 1c: file exist, folder is where file currently reside in (not moved)
    // Case 2: file does not exist (not moved)
  },

  /**
  * Upload a file from drive to database
  *
  * @param {File} file
  * @param {Folder} folder
  * @return {}
  */
  uploadFile: function uploadFile(file, folder) {
    console.log('fileOperation.uploadFile');
  },

  /**
  * Download a file from database to drive
  *
  * @param {File} file
  * @return {}
  */
  downloadFile: function downloadFile(file) {
    console.log('fileOperation.downloadFile');
  },

  /**
  * Export a file from database to drive
  *
  * @param {File} file
  * @param {String} fileFormat
  * @return {}
  */
  exportFile: function exportFile(file, fileFormat) {
    console.log('fileOperation.exportFile');
  },

   /**
  * Rename a file in database
  *
  * @param {String} newFileName
  * @param {File} file
  * @return {}
  */
  renameFile: function renameFile(newFileName, file) {
    console.log('fileOperation.renameFile');
  }

};

module.exports = fileOperation;
