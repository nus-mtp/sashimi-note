import constants from '../constants';

import exceptions from '../exceptions';

import SqlCommands from '../sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataDelete {
  static constructor() {}

  static deleteAllEntities() {
    for (let index = 0; index < constants.ARRAY_ENTITIES_NAME.length; index += 1) {
      sqlCommands.deleteTable(constants.ARRAY_ENTITIES_NAME[index]);
    }
  }

  static deleteFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(sqlCommands.deleteFile(fileId));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }


  static deleteFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(sqlCommands.deleteFolder(folderId));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
