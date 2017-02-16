// Import module interfacing with storage API

// folder stack
const stack = {};

const fileManager = {

  getList: function getList() {},

  /* File related operations */
  createFile: function createFile(fileName, folderID) {},
  deleteFile: function deleteFile(fileID) {},
  saveFile: function saveFile(fileID, data) {},
  loadFile: function loadFile(fileID) {},
  copyFile: function copyFile(fileID) {},
  downloadFile: function downloadFile(fileID) {}, // return md file
  exportFile: function exportFile(fileID, fileFormat) {},
  uploadFile: function uploadFile(fileID, fileName, fileObj) {},

  /* Folder related operations */
  createFolder: function createFolder(folderName, folderID) {},
  deleteFolder: function deleteFolder(folderID) {},
  previousFolder: function previousFolder(folderID) {}

};

module.exports = fileManager;
