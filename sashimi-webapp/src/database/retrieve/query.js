/*
 *
 * CS3283/4 - query.js
 * This class deals with query statements for the facade storage
 * This class will communicate with sqlCommands to get a certain command for
 *
 */

import SqlCommands from 'src/database/sql-related/sqlCommands';
import exceptions from 'src/database/exceptions';
import constants from 'src/database/constants';
import StringManipulator from 'src/database/stringManipulation';

const stringManipulator = new StringManipulator();

const sqlCommands = new SqlCommands();

// dummy function to init sequence running for code aesthetic below
function initPromiseSequence() {
  return new Promise((resolve, reject) =>
    resolve()
  );
}

export default class query {
  static constructor() {}

  static getAllFilesAndFolders() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        const promiseArr = [];
        initPromiseSequence()
        .then(() =>
          sqlCommands.getFullTableData(constants.ENTITIES_FILE_MANAGER)
          .then(fileArr => promiseArr.push(fileArr))
          .catch(sqlError => reject(sqlError)))
        .then(() =>
          sqlCommands.getFullTableData(constants.ENTITIES_FOLDER)
          .then(folderArr => promiseArr.push(folderArr))
          .catch(sqlError => reject(sqlError)))
        .then(() => resolve(promiseArr))
        .catch(sqlErr => reject(sqlErr));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static isTableExistsInDatabase(tableName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.getFullTableData(tableName)
        .then(() => resolve(true))
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

        initPromiseSequence()
        .then(() => sqlCommands.partialSearchFileName(searchString)
          .then(fileArr => promiseArr.push(fileArr))
          .catch(sqlError => reject(sqlError)))
        .then(() => sqlCommands.partialSearchFolderName(searchString)
          .then(folderArr => promiseArr.push(folderArr))
          .catch(sqlError => reject(sqlError)))
        .then(() => resolve(promiseArr))
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

        initPromiseSequence()
        .then(() => sqlCommands.loadFilesFromFolder(folderId)
          .then(fileArr => promiseArr.push(fileArr))
          .catch(sqlError => reject(sqlError)))
        .then(() => sqlCommands.loadFoldersFromFolder(folderId)
          .then(folderArr => promiseArr.push(folderArr))
          .catch(sqlError => reject(sqlError)))
        .then(() => resolve(promiseArr))
        .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.loadFile(fileId)
        .then((fileContent) => {
          fileContent = stringManipulator.replaceAll(fileContent, '\\"', '"');
          resolve(fileContent);
        })
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
