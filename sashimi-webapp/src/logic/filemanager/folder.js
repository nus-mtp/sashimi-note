/**
* Folder Object
*
* @param {Number} folderID
* @param {String} folderName
* @param {String} folderPath
*/
function Folder(folderID, folderName, folderPath) {
  this.folderID = folderID;
  this.folderName = folderName;
  this.folderPath = folderPath;
}

module.exports = Folder;
