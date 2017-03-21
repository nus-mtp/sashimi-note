/*
 * CS3283/4 dataModifier.js
 * This acts as a facade class for modifying and update data for storage facade
 *
 */

import dataAdd from 'src/database/data-modifier/dataAdd';
import dataDelete from 'src/database/data-modifier/dataDelete';
import dataUpdate from 'src/database/data-modifier/dataUpdate';

export default class dataModifier {
  static constructor() {}

  static deleteAllEntities(databaseName) {
    return dataDelete.deleteAllEntities(databaseName);
  }

  static createNewFile(organizationId, filePath, folderId) {
    return dataAdd.createNewFile(organizationId, filePath, folderId);
  }

  static createNewFolder(organizationId, folderPath, folderId) {
    return dataAdd.createNewFolder(organizationId, folderPath, folderId);
  }

  static moveFile(fileId, newPath) {
    return dataUpdate.changeFilePath(fileId, newPath);
  }

  static copyFile(fileId) {
    return dataAdd.duplicateFile(fileId);
  }

  static renameFileName(fileId, newFileName) {
    return dataUpdate.changeFileName(fileId, newFileName);
  }

  static renameFolderName(folderId, newFolderName) {
    return dataUpdate.changeFolderName(folderId, newFolderName);
  }

  static saveFile(fileId, fileContent) {
    return dataUpdate.saveFile(fileId, fileContent);
  }

  static deleteFile(fileId) {
    return dataDelete.deleteFile(fileId);
  }

  static deleteFolder(folderId) {
    return dataDelete.deleteFolder(folderId);
  }
}
