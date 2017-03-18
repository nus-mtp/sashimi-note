/*
 * CS3283/4 dataModifier.js
 * This acts as a facade class for modifying and update data for storage facade
 *
 */

import dataAdd from 'src/database/data-modifier/dataAdd';
import dataDelete from 'src/database/data-modifier/dataDelete';
import dataUpdate from 'src/database/data-modifier/dataUpdate';
import SqlCommands from 'src/database/sql-related/sqlCommands';
import StringManipulator from 'src/database/stringManipulation';

const stringManipulator = new StringManipulator();

const sqlCommands = new SqlCommands();

function resolveFileSaving(fileContent) {
  return stringManipulator.replaceAll(fileContent, '"', '\\"');
}

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
    return sqlCommands.changeFilePath(fileId, newPath);
  }

  static renameFileName(fileId, newFileName) {
    return sqlCommands.changeFileName(fileId, newFileName);
  }

  static renameFolderName(folderId, newFolderName) {
    return sqlCommands.changeFolderName(folderId, newFolderName);
  }

  static saveFile(fileId, fileContent) {
    fileContent = resolveFileSaving(fileContent);
    return dataUpdate.saveFile(fileId, fileContent);
  }

  static deleteFile(fileId) {
    return dataDelete.deleteFile(fileId);
  }

  static deleteFolder(folderId) {
    return dataDelete.deleteFolder(folderId);
  }
}
