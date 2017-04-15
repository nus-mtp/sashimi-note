/**
 *
 *  CS3283/4 storage.js
 *  This class acts as a facade for other developers to access to the database.
 *  The implementation is a non-SQL local storage to support the WebApp.
 *
 */

import constants from 'src/database/constants';
import entitiesCreator from 'src/database/create/entitiesCreator';
import query from 'src/database/retrieve/query';
import dataModifier from 'src/database/data-modifier/dataModifier';

let databaseName = constants.INDEXEDDB_NAME;

function createUserTable(isUserTableFirstInitialize) {
  return new Promise((resolve, reject) => {
    if (!isUserTableFirstInitialize) {
      entitiesCreator.createUserTable()
      .then(success => resolve(true))
      .catch(sqlError => reject(sqlError));
    } else {
      resolve('false');
    }
  });
}

function createOrganizationTable(isOrganizationTableFirstInitialize) {
  return new Promise((resolve, reject) => {
    if (!isOrganizationTableFirstInitialize) {
      entitiesCreator.createOrganizationTable()
      .then(success => resolve(true))
      .catch(sqlError => reject(sqlError));
    } else {
      resolve('false');
    }
  });
}

function createFolderTable(isFolderTableFirstInitialize) {
  return new Promise((resolve, reject) => {
    if (!isFolderTableFirstInitialize) {
      entitiesCreator.createFolderTable()
      .then(success => resolve(true))
      .catch(sqlError => reject(sqlError));
    } else {
      resolve('false');
    }
  });
}

function createFileManagerTable(isFileTableFirstInitialize) {
  return new Promise((resolve, reject) => {
    if (!isFileTableFirstInitialize) {
      entitiesCreator.createFileManagerTable()
      .then(success => resolve(true))
      .catch(sqlError => reject(sqlError));
    } else {
      resolve('false');
    }
  });
}

function creationOfTables() {
  return new Promise((resolve, reject) => {
    query.isTableExistsInDatabase(constants.ENTITIES_USER)
    .then(isUserTableFirstInitialize =>
      createUserTable(isUserTableFirstInitialize)
      .then(isSuccess => isSuccess)
      .catch(sqlError => reject(sqlError))
    )
    .then(() =>
      query.isTableExistsInDatabase(constants.ENTITIES_ORGANIZATION)
      .then(isOrganizationTableFirstInitialize =>
        createOrganizationTable(isOrganizationTableFirstInitialize))
        .then(isSuccess => isSuccess)
        .catch(sqlError => reject(sqlError))
      .catch(sqlError => reject(sqlError))
    )
    .then(() =>
      query.isTableExistsInDatabase(constants.ENTITIES_FOLDER)
      .then(isFolderTableFirstInitialize =>
        createFolderTable(isFolderTableFirstInitialize))
        .then(isSuccess => isSuccess)
        .catch(sqlError => reject(sqlError))
      .catch(sqlError => reject(sqlError))
    )
    .then(() =>
      query.isTableExistsInDatabase(constants.ENTITIES_FILE_MANAGER)
      .then(isFileTableFirstInitialize =>
        createFileManagerTable(isFileTableFirstInitialize)
        .then(isSuccess => isSuccess)
        .catch(sqlError => reject(sqlError))
      )
      .catch(sqlError => reject(sqlError))
    )
    .then(isSuccess => resolve(isSuccess))
    .catch(sqlError => reject(sqlError));
  });
}

export default class storage {
  static constructor() {}

  /**
   * Initialize indexedDB with default database name
   *
   * @return {Promise}
  */
  static initializeDatabase(newDatabaseName) {
    return new Promise((resolve, reject) => {
      databaseName = newDatabaseName || databaseName;
      return entitiesCreator.initializeDatabase(databaseName)
      .then(step1 =>
        creationOfTables()
        .then(isFirstInstance => isFirstInstance)
        .catch(sqlErr => reject(sqlErr)))
      /*
       * if table is first created, extra-checking that the data is boolean
       * it will fill up the table,
       * otherwise no data will be filled.
       */
      .then((isFirstInstance) => {
        if (typeof isFirstInstance === 'boolean') {
          return entitiesCreator.fillUpDefaultData()
          .then(isFilledUp => resolve(isFilledUp))
          .catch(sqlErr => reject(sqlErr));
        } else {
          return resolve(true);
        }
      })
      .catch(sqlError => reject(sqlError));
    });
  }

  /**
   * retrieve all files and folders in database
   *
   * @return {Promise}
   * @return [[files],[folders]]
  */
  static loadAllFilesAndFolders() {
    return query.getAllFilesAndFolders();
  }

  /**
   * searching files and folders with partial phrase
   *
   * @param string searchString
   * @return {Promise}
   * @return [[files],[folders]]
  */
  static partialSearch(searchString) {
    return query.searchString(searchString);
  }

  /**
   * get all files and folders inside this folder
   *
   * @param number folderId
   * @return {Promise}
   * @return [[files],[folders]]
  */
  static getList(folderId) {
    return query.loadFolder(folderId);
  }

  /**
   * retrieve md string in file
   *
   * @param number fileId
   * @return {Promise}
   * @return string
  */
  static loadFile(fileId) {
    return query.loadFile(fileId);
  }

  /**
   * retrieve md string in file
   *
   * @param number fileId, string fileString
   * @return {Promise}
  */
  static saveFile(fileId, fileString) {
    return dataModifier.saveFile(fileId, fileString);
  }

  /**
   * create a new file
   *
   * @param number organizationId, string filePath, number folderId
   * @return {Promise}
  */
  static createFile(organizationId, filePath, folderId) {
    return dataModifier.createNewFile(organizationId, filePath, folderId);
  }

  /**
   * relocate a file to a new location
   *
   * @param number fileId, string newPath
   * @return {Promise}
  */
  static moveFile(fileId, newPath) {
    return dataModifier.moveFile(fileId, newPath);
  }

  /**
   * duplicate a file
   *
   * @param number fileId
   * @return {Promise}
  */
  static copyFile(fileId) {
    return dataModifier.copyFile(fileId);
  }

  /**
   * rename a file
   *
   * @param number fileId, string newFileName
   * @return {Promise}
  */
  static renameFile(fileId, newFileName) {
    return dataModifier.renameFileName(fileId, newFileName);
  }

  /**
   * rename a folder and all its children
   *
   * @param number folderId, string newFolderName
   * @return {Promise}
  */
  static renameFolder(folderId, newFolderName) {
    return dataModifier.renameFolderName(folderId, newFolderName);
  }

  /**
   * removes a file from database
   *
   * @param number fileId
   * @return {Promise}
  */
  static deleteFile(fileId) {
    return dataModifier.deleteFile(fileId);
  }

  /**
   * creates a new folder in database
   *
   * @param number organizationId, string folderPath, number currentFolderId
   * @return {Promise}
  */
  static createFolder(organizationId, folderPath, currentFolderId) {
    return dataModifier.createNewFolder(organizationId, folderPath, currentFolderId);
  }

  /**
   * removes a folder and cascade delete
   *
   * @param number folderId
   * @return {Promise}
  */
  static deleteFolder(folderId) {
    return dataModifier.deleteFolder(folderId);
  }

  /**
   * exceptions to check if called
   * @return exceptions
  */
  static exceptions;

}
