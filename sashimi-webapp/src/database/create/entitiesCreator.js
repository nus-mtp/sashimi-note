import constants from 'src/database/constants';
import tableCreator from 'src/database/create/tableCreator';
import initDataGenerator from 'src/database/create/initDataGenerator';
import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();
let thisDatabaseName = constants.INDEXEDDB_NAME;

function isTableExists(tableName) {
  return new Promise((resolve, reject) => {
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

function defaultFillUpUserTable() {
  return isTableExists(constants.ENTITIES_USER)
  .then(isExist =>
    sqlCommands.insertContent(constants.ENTITIES_USER,
      initDataGenerator.getInitDataUser())
  );
}

function defaultFillUpOrganizationTable() {
  return isTableExists(constants.ENTITIES_ORGANIZATION)
  .then(isExist =>
    sqlCommands.insertContent(constants.ENTITIES_ORGANIZATION,
      initDataGenerator.getInitDataOrganization())
  );
}

function defaultFillUpFileManagerTable() {
  return isTableExists(constants.ENTITIES_FILE_MANAGER)
  .then(isExist =>
    sqlCommands.insertContent(constants.ENTITIES_FILE_MANAGER,
      initDataGenerator.getInitDataFileManager())
  );
}

function defaultFillUpFolderTable() {
  return isTableExists(constants.ENTITIES_FOLDER)
  .then(isExist =>
    sqlCommands.insertContent(constants.ENTITIES_FOLDER,
      initDataGenerator.getInitDataFolder())
  );
}

export default class entitiesCreator {

  static constuctor() {}

  static initializeDatabase(databaseName) {
    thisDatabaseName = databaseName || constants.INDEXEDDB_NAME;
    return tableCreator.callSqlToLinkToDatabase(databaseName);
  }

  static createUserTable() {
    tableCreator.initCreateTable(constants.ENTITIES_USER);

    tableCreator.addHeader(constants.HEADER_USER_TOKEN, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_PASSWORD, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_EMAIL, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_USERNAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_USER_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_USER_CREATION_DATE, 'NUMBER');

    tableCreator.setPrimaryKeys(constants.HEADER_USER_USER_ID);

    return tableCreator.endCreateTable();
  }

  static createOrganizationTable() {
    tableCreator.initCreateTable(constants.ENTITIES_ORGANIZATION);

    tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_NAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_CREATION_DATE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_TYPE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_USER_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, 'NUMBER');

    tableCreator.setPrimaryKeys(constants.HEADER_ORGANIZATION_ORGANIZATION_ID,
                                constants.HEADER_ORGANIZATION_USER_ID);

    return tableCreator.endCreateTable();
  }

  static createFileManagerTable() {
    tableCreator.initCreateTable(constants.ENTITIES_FILE_MANAGER);

    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FOLDER_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_NAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_MARKDOWN, 'STRING');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_CREATION_DATE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_PATH, 'STRING');

    tableCreator.setPrimaryKeys(constants.HEADER_FILE_MANAGER_FILE_ID,
                                constants.HEADER_FILE_MANAGER_ORGANIZATION_ID);
    return tableCreator.endCreateTable();
  }

  static createFolderTable() {
    tableCreator.initCreateTable(constants.ENTITIES_FOLDER);

    tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_PARENT_FOLDER_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_PERMISSION_INDEX, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_ORGANIZATION_ID, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_CREATION_DATE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_NAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_FOLDER_LAST_MODIFIED_DATE, 'NUMBER');
    tableCreator.addHeader(constants.HEADER_FOLDER_PATH, 'STRING');

    tableCreator.setPrimaryKeys(constants.HEADER_FOLDER_ORGANIZATION_ID,
                                constants.HEADER_FOLDER_FOLDER_ID);
    return tableCreator.endCreateTable();
  }

  static fillUpDefaultData() {
    return new Promise((resolve, reject) =>
      defaultFillUpUserTable()
      .then(() =>
        defaultFillUpOrganizationTable()
        .catch(sqlErr => reject(sqlErr)))
      .then(() =>
        defaultFillUpFolderTable()
        .catch(sqlErr => reject(sqlErr)))
      .then(() =>
        defaultFillUpFileManagerTable()
        .catch(sqlErr => reject(sqlErr)))
      .then(isSuccess => resolve(isSuccess))
      .catch(sqlError => reject(sqlError)));
  }
}
