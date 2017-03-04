import StringManipulator from '../stringManipulation';

import exceptions from '../exceptions';

import constants from '../constants';

import DateTime from '../generated-data/dateTime';

const alasql = require('alasql');

const stringManipulator = new StringManipulator();

const dateTime = new DateTime();

function getDataOutOfAlasql(data) {
  return Object.values(data[0][0])[0];
}

function getFormattedCurrentDateTime() {
  return stringManipulator.stringConcat('"', dateTime.getCurrentDateTime(), '"');
}

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

export default function sqlCommands() {
  this.linkDatabaseToIndexedDB = function linkDatabaseToIndexedDB() {
    const databaseRequestStr = 'CREATE INDEXEDDB DATABASE IF NOT EXISTS lectureNote; ' +
                               'ATTACH INDEXEDDB DATABASE lectureNote; ' +
                               'USE lectureNote;';
    alasql.promise([databaseRequestStr])
      .then().catch(sqlError => sqlError);
  };

  this.getFullTableData = function getFullTableData(tableName) {
    // ensure working in browsers that support Promise
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', tableName)])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError)));
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.createTable = function createTable(sqlStatement) {
    alasql.promise([stringManipulator.stringConcat('CREATE TABLE IF NOT EXISTS ', sqlStatement)])
      .then().catch(sqlError => sqlError);
  };

  this.insertContent = function insertContent(tableName, ...content) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        // concatenate all the values to insert together
        const valuesToInsertIntoTable = content.join(', ');
        alasql.promise([stringManipulator.stringConcat('INSERT INTO ', tableName,
                                                       ' VALUES (', valuesToInsertIntoTable, ')')])
        .then(() => true)
        .catch(sqlError => sqlError);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.partialSearchFileName = function partialSearchFileName(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', constants.ENTITIES_FILE_MANAGER,
                                                       ' WHERE ', constants.HEADER_FILE_MANAGER_FILE_NAME,
                                                       ' LIKE "%', searchString, '%"')])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };
  this.getMaxFileId = function getMaxFileId() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT max(', constants.HEADER_FILE_MANAGER_FILE_ID,
                                                       ') FROM ', constants.ENTITIES_FILE_MANAGER)])
        .then((data) => {
          const maxFileId = getDataOutOfAlasql(data);
          if (typeof maxFileId === 'number') {
            resolve(maxFileId);
          } else {
            resolve(-1);
          }
        }).catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };
  this.getMaxFolderId = function getMaxFolderId() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT MAX(', constants.HEADER_FOLDER_FOLDER_ID,
                                                       ') FROM ', constants.ENTITIES_FOLDER)])
        .then((data) => {
          const maxFolderId = getDataOutOfAlasql(data);
          if (typeof maxFolderId === 'number') {
            resolve(maxFolderId);
          } else {
            resolve(0);
          }
        }).catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.partialSearchFolderName = function partialSearchFolderName(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', constants.ENTITIES_FOLDER,
                                                       ' WHERE ', constants.HEADER_FOLDER_FOLDER_NAME,
                                                       ' LIKE "%', searchString, '%"')])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.loadFilesFromFolder = function loadFilesFromFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', constants.ENTITIES_FILE_MANAGER,
                                                       ' WHERE ', constants.HEADER_FILE_MANAGER_FOLDER_ID,
                                                       ' = ', folderId)])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.loadFoldersFromFolder = function loadFoldersFromFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', constants.ENTITIES_FOLDER,
                                                       ' WHERE ', constants.HEADER_FOLDER_PARENT_FOLDER_ID,
                                                       ' = ', folderId,
                                                       ' AND ', constants.HEADER_FOLDER_PARENT_FOLDER_ID,
                                                       ' != NULL')])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.loadFile = function loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('SELECT ', constants.HEADER_FILE_MANAGER_FILE_MARKDOWN,
                                                       ' FROM ', constants.ENTITIES_FILE_MANAGER,
                                                       ' WHERE ', constants.HEADER_FILE_MANAGER_FILE_ID,
                                                       ' = ', fileId)])
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.saveFile = function saveFile(fileId, markdownFile) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        initPromiseSequence()
        .then(() => alasql.promise([stringManipulator.stringConcat('UPDATE ', constants.ENTITIES_FILE_MANAGER,
                                                                   ' SET ', constants.HEADER_FILE_MANAGER_FILE_MARKDOWN,
                                                                   ' = "', markdownFile,
                                                                   '" WHERE ', constants.HEADER_FILE_MANAGER_FILE_ID,
                                                                   ' = ', fileId)])
          .catch(sqlError => reject(sqlError)))
        .then(() => {
          const currentDateTime = getFormattedCurrentDateTime();
          alasql.promise([stringManipulator.stringConcat('UPDATE ', constants.ENTITIES_FILE_MANAGER,
                                                         ' SET ', constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE,
                                                         ' = "', currentDateTime,
                                                         '" WHERE ', constants.HEADER_FILE_MANAGER_FILE_ID,
                                                         ' = ', fileId)])
          .catch(sqlError => reject(sqlError));
        })
        .then(() => resolve(true))
        .catch(sqlErr => reject(sqlErr));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.deleteFile = function deleteFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('DELETE FROM ', constants.ENTITIES_FILE_MANAGER,
                                                       ' WHERE ', constants.HEADER_FILE_MANAGER_FILE_ID,
                                                       ' = ', fileId)])
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.deleteFolder = function deleteFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('DELETE FROM ', constants.ENTITIES_FOLDER,
                                                       ' WHERE ', constants.HEADER_FOLDER_FOLDER_ID,
                                                       ' = ', folderId)])
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };

  this.deleteTable = function deleteTable(tableName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        alasql.promise([stringManipulator.stringConcat('DROP TABLE IF EXISTS ', tableName, ';')])
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  };
}
