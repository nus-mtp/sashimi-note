/*
 *
 * CS3283/4 - query.js
 * This class deals with query statements for the facade storage
 * This class will communicate with sqlCommands to get a certain command for
 *
 */

import SqlCommands from '../sql-related/sqlCommands';

import exceptions from '../exceptions';

const sqlCommands = new SqlCommands();

export default class query {
  static constructor() {}

  static isTableExistsInDatabase(tableName) {
    sqlCommands.getFullTableData(tableName)
      .then(data => true).catch(sqlErr => false);
  }

  static getFullTableData(tableName) {
    return sqlCommands.getFullTableData(tableName);
  }

  static searchString(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(() => {
          let fileArr;
          let folderArr;

          sqlCommands.partialSearchFile(searchString)
            .then((returnedArr) => {
              fileArr = returnedArr;
            })
            .catch(sqlError => sqlError);

          sqlCommands.partialSearchFolder(searchString)
            .then((returnedArr) => {
              folderArr = returnedArr;
            })
            .catch(sqlError => sqlError);

          resolve([fileArr, folderArr]);
        });
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(() => {
          let fileArr;
          let folderArr;
          sqlCommands.loadFilesFromFolder(folderId)
            .then((returnedArr) => {
              fileArr = returnedArr;
            }).catch(sqlError => sqlError);

          sqlCommands.loadFoldersFromFolder(folderId)
            .then((returnedArr) => {
              folderArr = returnedArr;
            }).catch(sqlError => sqlError);

          resolve([fileArr, folderArr]);
        });
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(() => {
          sqlCommands.loadFile(fileId)
          .then(data => data)
          .catch(sqlError => sqlError);
        });
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

}
