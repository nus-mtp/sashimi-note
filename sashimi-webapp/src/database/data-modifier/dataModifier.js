/*
 * CS3283/4 dataModifier.js
 * This acts as a facade class for modifying and update data for storage facade
 *
 */

import dataAdd from 'src/database/data-modifier/dataAdd';
import dataDelete from 'src/database/data-modifier/dataDelete';
import dataUpdate from 'src/database/data-modifier/dataUpdate';
import exceptions from 'src/database/exceptions';
import SqlCommands from 'src/database/sql-related/sqlCommands';
import StringManipulator from 'src/database/stringManipulation';

export default class dataModifier {
  static constructor() {}

  static deleteAllEntities(databaseName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataDelete.deleteAllEntities(databaseName)
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createNewFile(organizationId, filePath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataAdd.createNewFile(organizationId, filePath, folderId)
        .then(fileId => resolve(fileId))
        .catch(sqlErr => reject(sqlErr))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createNewFolder(organizationId, folderPath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataAdd.createNewFolder(organizationId, folderPath, folderId)
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static saveFile(fileId, file) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataUpdate.saveFile(fileId, file)
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static deleteFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataDelete.deleteFile(fileId)
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static deleteFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataDelete.deleteFolder(folderId)
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
