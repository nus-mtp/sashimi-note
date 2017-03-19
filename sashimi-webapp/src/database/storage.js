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

  static loadAllFilesAndFolders() {
    return query.getAllFilesAndFolders();
  }

  // Searching the filename and foldername ONLY
  static partialSearch(searchString) {
    return query.searchString(searchString);
  }

  static getList(folderId) {
    return query.loadFolder(folderId);
  }

  static loadFile(fileId) {
    return query.loadFile(fileId);
  }

  static saveFile(fileId, fileString) {
    return dataModifier.saveFile(fileId, fileString);
  }

  static createFile(organizationId, filePath, folderId) {
    return dataModifier.createNewFile(organizationId, filePath, folderId);
  }

  static moveFile(fileId, newPath) {
    return dataModifier.moveFile(fileId, newPath);
  }

  static renameFile(fileId, newFileName) {
    return dataModifier.renameFileName(fileId, newFileName);
  }

  static renameFolder(folderId, newFolderName) {
    return dataModifier.renameFolderName(folderId, newFolderName);
  }

  static deleteFile(fileId) {
    return dataModifier.deleteFile(fileId);
  }

  static createFolder(organizationId, folderPath, currentFolderId) {
    return dataModifier.createNewFolder(organizationId, folderPath, currentFolderId);
  }

  // only delete folder for now without cascade delete
  static deleteFolder(folderId) {
    return dataModifier.deleteFolder(folderId);
  }

  static deleteAll(newDatabaseName) {
    databaseName = newDatabaseName || databaseName;
    return dataModifier.deleteAllEntities(databaseName);
  }
}
