/*
 *
 * CS3283/4 - query.js
 * This class deals with query statements for the facade storage
 * This class will communicate with sqlCommands to get a certain command for
 *
 */

import SqlCommands from 'src/database/sql-related/sqlCommands';
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
    return new Promise((resolve, reject) => {
      const fileAndFolderArray = [];
      initPromiseSequence()
      .then(() =>
        sqlCommands.getFullTableData(constants.ENTITIES_FILE_MANAGER)
        .then(fileArr => fileAndFolderArray.push(fileArr))
        .catch(sqlError => reject(sqlError)))
      .then(() =>
        sqlCommands.getFullTableData(constants.ENTITIES_FOLDER)
        .then(folderArr => fileAndFolderArray.push(folderArr))
        .catch(sqlError => reject(sqlError)))
      .then(() => resolve(fileAndFolderArray))
      .catch(sqlErr => reject(sqlErr));
    });
  }

  static isTableExistsInDatabase(tableName, databaseName) {
    return new Promise((resolve, reject) => {
      const thisDatabaseName = databaseName || constants.INDEXEDDB_NAME;
      const requestOpenDatabase = indexedDB.open(thisDatabaseName);
      requestOpenDatabase.onsuccess = function onSuccess(event) {
        const tableNames = event.target.result.objectStoreNames;
        if (tableNames.contains(tableName) === false) {
          requestOpenDatabase.result.close();
          resolve(false);
        } else {
          requestOpenDatabase.result.close();
          resolve(true);
        }
      };
      // if database version not supported, implies table does not exists
      requestOpenDatabase.onupgradeneeded = function onUpgradeNeeded(event) {
        resolve(false);
      };
    });
  }

  static getFullTableData(tableName) {
    return sqlCommands.getFullTableData(tableName);
  }

  static searchString(searchString) {
    return new Promise((resolve, reject) => {
      const fileAndFolderArray = [];

      initPromiseSequence()
      .then(() => sqlCommands.partialSearchFileName(searchString)
        .then(fileArr => fileAndFolderArray.push(fileArr))
        .catch(sqlError => reject(sqlError)))
      .then(() => sqlCommands.partialSearchFolderName(searchString)
        .then(folderArr => fileAndFolderArray.push(folderArr))
        .catch(sqlError => reject(sqlError)))
      .then(() => resolve(fileAndFolderArray))
      .catch(sqlErr => reject(sqlErr));
    });
  }

  static loadFolder(folderId) {
    return new Promise((resolve, reject) => {
      const fileAndFolderArray = [];

      initPromiseSequence()
      .then(() => sqlCommands.loadFilesFromFolder(folderId)
        .then(fileArr => fileAndFolderArray.push(fileArr))
        .catch(sqlError => reject(sqlError)))
      .then(() => sqlCommands.loadFoldersFromFolder(folderId)
        .then(folderArr => fileAndFolderArray.push(folderArr))
        .catch(sqlError => reject(sqlError)))
      .then(() => resolve(fileAndFolderArray))
      .catch(sqlError => reject(sqlError));
    });
  }

  static loadFile(fileId) {
    return new Promise((resolve, reject) =>
      sqlCommands.loadFile(fileId)
      .then((fileContent) => {
        fileContent = stringManipulator.revertSQLInjections(fileContent);
        resolve(fileContent);
      })
      .catch(sqlError => reject(sqlError))
    );
  }
}
