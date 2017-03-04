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

  // working
  static isTableExistsInDatabase(tableName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.getFullTableData(tableName)
          .then(data => resolve(true))
          .catch(sqlErr => resolve(false))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static getFullTableData(tableName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.getFullTableData(tableName)
          .then(data => resolve(data))
          .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static searchString(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        const promiseArr = [];

        sqlCommands.partialSearchFile(searchString)
          .then(fileArr => promiseArr.push(promiseArr))
          .catch(sqlError => reject(sqlError));

        sqlCommands.partialSearchFolder(searchString)
          .then(folderArr => promiseArr.push(promiseArr))
          .catch(sqlError => reject(sqlError));

        return Promise.all(promiseArr)
          .then(([fileArr, folderArr]) => resolve([fileArr, folderArr]))
          .catch(sqlErr => reject(sqlErr));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        const promiseArr = [];

        sqlCommands.loadFilesFromFolder(folderId)
          .then(fileArr => promiseArr.push(promiseArr))
          .catch(sqlError => reject(sqlError));

        sqlCommands.loadFoldersFromFolder(folderId)
          .then(folderArr => promiseArr.push(promiseArr))
          .catch(sqlError => reject(sqlError));

        return Promise.all(promiseArr)
          .then(([fileArr, folderArr]) => resolve([fileArr, folderArr]))
          .catch(sqlErr => reject(sqlErr));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.loadFile(fileId)
          .then(data => resolve(data))
          .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

}
