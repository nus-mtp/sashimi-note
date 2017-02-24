/**
* File Object
*
* @param {Number} fileID
* @param {String} fileName
* @param {String} filePath
*/
function File(fileID, fileName, filePath) {
  this.fileID = fileID;
  this.fileName = fileName;
  this.filePath = filePath;
  console.log('new File created');
}

module.exports = File;
