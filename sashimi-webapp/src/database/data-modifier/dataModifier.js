/*
 * CS3283/4 dataModifier.js
 * This acts as a facade class for modifying and update data for storage facade
 *
 */

import dataAdd from './dataAdd';
import dataDelete from './dataDelete';
import dataUpdate from './dataUpdate';
import exceptions from '../exceptions';

export default class dataModifier {
  static constructor() {}

  static deleteAllEntities() {
    dataDelete.deleteAllEntities();
  }

  static createNewFile(organizationId, filePath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        dataAdd.createNewFile(organizationId, filePath, folderId)
          .then((fileId) => {
            console.log('DATAMODIFIER');
            console.log(fileId);
            resolve(fileId);
          }).catch(sqlErr => sqlErr);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createNewFolder(organizationId, folderPath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        dataAdd.createNewFolder(organizationId, folderPath, folderId)
          .then(data => true)
          .catch(sqlErr => sqlErr);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static saveFile(fileId, file) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(dataUpdate.saveFile(fileId, file)
          .then(() => true))
          .catch(sqlError => sqlError);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
