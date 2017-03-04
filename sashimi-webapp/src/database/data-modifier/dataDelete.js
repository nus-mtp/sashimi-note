import constants from '../constants';

import exceptions from '../exceptions';

import SqlCommands from '../sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataDelete {
  static constructor() {}

  static deleteAllEntities(index) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        if (index < constants.ARRAY_ENTITIES_NAME.length -1) {
          sqlCommands.deleteTable(constants.ARRAY_ENTITIES_NAME[index])
          .then(data => this.deleteAllEntities(index+1))
          .catch(sqlError => reject(sqlError));
          resolve(true);
        }
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static deleteFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.deleteFile(fileId)
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }


  static deleteFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.deleteFolder(folderId)
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
