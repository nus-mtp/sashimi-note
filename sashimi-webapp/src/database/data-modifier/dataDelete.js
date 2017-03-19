import constants from 'src/database/constants';
import exceptions from 'src/database/exceptions';
import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

// dummy function to init sequence running
function initPromiseSequence() {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}

export default class dataDelete {
  static constructor() {}

  /*
   * external library not functioning so I cannot do anything here
   * link of bug: https://github.com/agershun/alasql/issues/414
   * force delete
   */
  static deleteAllEntities(databaseName) {
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
  }

  static deleteFile(fileId) {
    return sqlCommands.deleteFile(fileId);
  }


  static deleteFolder(folderId) {
    return sqlCommands.deleteFolder(folderId);
  }
}
