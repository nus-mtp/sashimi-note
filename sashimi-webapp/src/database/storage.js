/**
 *
 *  CS3283/4 storage.js
 *  This class acts as a facade for other developers to access to the database.
 *  The implementation is a non-SQL local storage to support the WebApp.
 *
 */

import entitiesCreator from './create/entitiesCreator';

import query from './retrieve/query'; // for debugging

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

  static getList(folderID, callback) {

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

  }

  static deleteFolder(folderID) {

  }
}