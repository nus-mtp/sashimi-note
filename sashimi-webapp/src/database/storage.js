/**
 *
 *  CS3283/4 storage.js
 *  This class acts as a facade for other developers to access to the database.
 *  The implementation is a non-SQL local storage to support the WebApp.
 *
 */

import constants from './constants';

import entitiesCreator from './create/entitiesCreator';

import query from './retrieve/query';

import dataModifier from './data-modifier/dataModifier';

import exceptions from './exceptions';

// dummy function to initialize createTables promises
function initCreateTable() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createUserTable(isUserTableFirstInitialize) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      if (!isUserTableFirstInitialize) {
        entitiesCreator.createUserTable()
        .then(success => resolve(true))
        .catch(sqlError => reject(sqlError));
      } else {
        resolve('false');
      }
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createOrganizationTable(isOrganizationTableFirstInitialize) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      if (!isOrganizationTableFirstInitialize) {
        entitiesCreator.createOrganizationTable()
        .then(success => resolve(true))
        .catch(sqlError => reject(sqlError));
      } else {
        resolve('false');
      }
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createFolderTable(isFolderTableFirstInitialize) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      if (!isFolderTableFirstInitialize) {
        entitiesCreator.createFolderTable()
        .then(success => resolve(true))
        .catch(sqlError => reject(sqlError));
      } else {
        resolve('false');
      }
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createFileManagerTable(isFileTableFirstInitialize) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      if (!isFileTableFirstInitialize) {
        entitiesCreator.createFileManagerTable()
        .then(success => resolve(true))
        .catch(sqlError => reject(sqlError));
      } else {
        resolve('false');
      }
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function creationOfTables() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      initCreateTable()
      .then(() =>
        query.isTableExistsInDatabase(constants.ENTITIES_USER)
        .then(isUserTableFirstInitialize =>
          createUserTable(isUserTableFirstInitialize)
          .then(isSuccess => isSuccess)
          .catch(sqlError => reject(sqlError))
          )
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
      .then(() => query.isTableExistsInDatabase(constants.ENTITIES_FOLDER)
        .then(isFolderTableFirstInitialize =>
          createFolderTable(isFolderTableFirstInitialize))
          .then(isSuccess => isSuccess)
          .catch(sqlError => reject(sqlError))
        .catch(sqlError => reject(sqlError))
      )
      .then(() => query.isTableExistsInDatabase(constants.ENTITIES_FILE_MANAGER)
        .then(isFileTableFirstInitialize =>
          createFileManagerTable(isFileTableFirstInitialize)
          .then(isSuccess => isSuccess)
          .catch(sqlError => reject(sqlError)))
        .catch(sqlError => reject(sqlError))
      .then(isSuccess => resolve(isSuccess))
      .catch(sqlError => reject(sqlError))
      );
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

export default class storage {
  static constructor() {}

  static initializeDatabase() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        entitiesCreator.initializeDatabase()
        .then(step1 => creationOfTables()
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
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  // Searching the filename and foldername ONLY
  static partialSearch(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        query.searchString(searchString)
        .then(returnedArr => resolve(returnedArr))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static getList(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        query.loadFolder(folderId)
        .then(returnedArr => resolve(returnedArr))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        query.loadFile(fileId)
        .then(returnedArr => resolve(returnedArr))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static saveFile(fileId, fileString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.saveFile(fileId, fileString)
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createFile(organizationId, filePath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.createNewFile(organizationId, filePath, folderId)
        .then(data => resolve(data))
        .catch(err => reject(err))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static deleteFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.deleteFile(fileId)
          .then(data => resolve(true))
          .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createFolder(organizationId, folderPath, currentFolderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.createNewFolder(organizationId, folderPath, currentFolderId)
        .then(data => resolve(data))
        .catch(err => reject(err))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  // only delete folder for now without cascade delete
  static deleteFolder(folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.deleteFolder(folderId)
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static deleteAll() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        dataModifier.deleteAllEntities()
        .then(data => resolve(true))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
