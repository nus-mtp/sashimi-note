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

export default class storage {
  static constructor() {}

  static initializeDatabase() {
    entitiesCreator.initializeDatabase();
    entitiesCreator.createUserTable();
    entitiesCreator.createOrganizationTable();
    entitiesCreator.createFolderTable();
    entitiesCreator.createFileManagerTable();
    query.getFullTableData('user');
  }

  // Searching the filename and foldername ONLY
  static partialSearch(searchString) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        query.searchString(searchString)
          .then(returnedArr => returnedArr)
          .catch(sqlError => sqlError);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static loadFile(fileID) {

  }

  static saveFile(fileID, file) {

  }

  static createFile() {

  }

  static deleteFile(fileID) {

  }

  static createFolder() {

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
