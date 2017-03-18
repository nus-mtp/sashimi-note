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
      resolve(false);
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
    return new Promise((resolve, reject) =>
      query.getAllFilesAndFolders()
      .then(returnedArr => resolve(returnedArr))
      .catch(sqlError => reject(sqlError))
    );
  }

  // Searching the filename and foldername ONLY
  static partialSearch(searchString) {
    return new Promise((resolve, reject) =>
      query.searchString(searchString)
      .then(returnedArr => resolve(returnedArr))
      .catch(sqlError => reject(sqlError))
    );
  }

  static getList(folderId) {
    return new Promise((resolve, reject) =>
      query.loadFolder(folderId)
      .then(returnedArr => resolve(returnedArr))
      .catch(sqlError => reject(sqlError))
    );
  }

  static loadFile(fileId) {
    return new Promise((resolve, reject) =>
      query.loadFile(fileId)
      .then(returnedArr => resolve(returnedArr))
      .catch(sqlError => reject(sqlError))
    );
  }

  static saveFile(fileId, fileString) {
    return new Promise((resolve, reject) =>
      dataModifier.saveFile(fileId, fileString)
      .then(() => resolve())
      .catch(sqlError => reject(sqlError))
    );
  }

  static createFile(organizationId, filePath, folderId) {
    return new Promise((resolve, reject) =>
      dataModifier.createNewFile(organizationId, filePath, folderId)
      .then(fileObject => resolve(fileObject))
      .catch(sqlErr => reject(sqlErr))
    );
  }

  static moveFile(fileId, newPath) {
    return new Promise((resolve, reject) =>
      dataModifier.moveFile(fileId, newPath)
      .then(() => resolve())
      .catch(sqlErr => reject(sqlErr))
    );
  }

  static renameFileName(fileId, newFileName) {
    return new Promise((resolve, reject) =>
      dataModifier.renameFileName(fileId, newFileName)
      .then(() => resolve())
      .catch(err => reject(err))
    );
  }

  static renameFolderName(folderId, newFolderName) {
    return new Promise((resolve, reject) =>
      dataModifier.renameFolderName(folderId, newFolderName)
      .then(() => resolve())
      .catch(sqlErr => reject(sqlErr))
    );
  }

  static deleteFile(fileId) {
    return new Promise((resolve, reject) =>
      dataModifier.deleteFile(fileId)
        .then(() => resolve())
        .catch(sqlError => reject(sqlError))
    );
  }

  static createFolder(organizationId, folderPath, currentFolderId) {
    return new Promise((resolve, reject) =>
      dataModifier.createNewFolder(organizationId, folderPath, currentFolderId)
      .then(data => resolve(data))
      .catch(err => reject(err))
    );
  }

  // only delete folder for now without cascade delete
  static deleteFolder(folderId) {
    return new Promise((resolve, reject) =>
      dataModifier.deleteFolder(folderId)
      .then(() => resolve())
      .catch(sqlError => reject(sqlError))
    );
  }

  static deleteAll(newDatabaseName) {
    return new Promise((resolve, reject) => {
      databaseName = newDatabaseName || databaseName;
      return dataModifier.deleteAllEntities(databaseName)
      .then(() => resolve())
      .catch(sqlError => reject(sqlError));
    });
  }
}
