import constants from '../constants';

import exceptions from '../exceptions';

import SqlCommands from '../sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

// dummy function to init sequence running
function initPromiseSequence() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

export default class dataDelete {
  static constructor() {}

  /*
   * external library not functioning so I cannot do anything here
   * link of bug: https://github.com/agershun/alasql/issues/414
   * force delete
   */
  static deleteAllEntities(databaseName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        initPromiseSequence()
        .then(() =>
          sqlCommands.deleteTable(constants.ENTITIES_USER)
          .then(isSuccess => isSuccess)
          .catch(sqlErr => reject(sqlErr)))
        .then(() =>
          sqlCommands.deleteTable(constants.ENTITIES_ORGANIZATION)
          .then(isSuccess => isSuccess)
          .catch(sqlErr => reject(sqlErr)))
        .then(() =>
          sqlCommands.deleteTable(constants.ENTITIES_FILE_MANAGER)
          .then(isSuccess => isSuccess)
          .catch(sqlErr => reject(sqlErr)))
        .then(() =>
          sqlCommands.deleteTable(constants.ENTITIES_FOLDER)
          .then(isSuccess => isSuccess)
          .catch(sqlErr => reject(sqlErr)))
        .then(() => { // brute-force delete
          if (!window.indexedDB) {
            reject(exceptions.IndexedDBNotSupported);
          }
          return window.indexedDB.deleteDatabase(databaseName);
        })
        .then(() => resolve(true))
        .catch(sqlErr => reject(sqlErr)));
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
