/**
 *
 *  CS3283/4 storage.js
 *  This class acts as a facade for other developers to access to the database.
 *  The implementation is a non-SQL local storage to support the WebApp.
 *
 */

import entitiesCreator from './create/entitiesCreator';

export default class Storage {
  static constructor() {}

  static initializeDatabase() {
    entitiesCreator.createUserTable();
    entitiesCreator.createOrganizationTable();
    entitiesCreator.createFolderTable();
    entitiesCreator.createFileManagerTable();
    entitiesCreator.clearDatabase();
  }
}
