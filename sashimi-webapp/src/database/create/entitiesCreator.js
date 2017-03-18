import constants from 'src/database/constants';
import tableCreator from 'src/database/create/tableCreator';
import exceptions from 'src/database/exceptions';
import initDataGenerator from 'src/database/create/initDataGenerator';
import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

function isTableExists(tableName) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      sqlCommands.getFullTableData(tableName)
      .then(resolve(true))
      .catch(sqlErr => reject(false));
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function defaultFillUpUserTable() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      isTableExists(constants.ENTITIES_USER)
      .then(isExist =>
        sqlCommands.insertContent(constants.ENTITIES_USER,
          initDataGenerator.getInitDataUser())
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      )
    );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function defaultFillUpOrganizationTable() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      isTableExists(constants.ENTITIES_ORGANIZATION)
      .then(isExist =>
        sqlCommands.insertContent(constants.ENTITIES_ORGANIZATION,
          initDataGenerator.getInitDataOrganization())
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      )
    );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function defaultFillUpFileManagerTable() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      isTableExists(constants.ENTITIES_FILE_MANAGER)
      .then(isExist =>
        sqlCommands.insertContent(constants.ENTITIES_FILE_MANAGER,
          initDataGenerator.getInitDataFileManager())
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      )
    );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function defaultFillUpFolderTable() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      isTableExists(constants.ENTITIES_FOLDER)
      .then(isExist =>
        sqlCommands.insertContent(constants.ENTITIES_FOLDER,
          initDataGenerator.getInitDataFolder())
        .then(data => resolve(data))
        .catch(sqlErr => reject(sqlErr))
      )
    );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

export default class entitiesCreator {

  static constuctor() {}

  static initializeDatabase(databaseName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        tableCreator.callSqlToLinkToDatabase(databaseName)
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createUserTable() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        tableCreator.initCreateTable(constants.ENTITIES_USER);

        tableCreator.addHeader(constants.HEADER_USER_TOKEN, 'STRING');
        tableCreator.addHeader(constants.HEADER_USER_PASSWORD, 'STRING');
        tableCreator.addHeader(constants.HEADER_USER_EMAIL, 'STRING');
        tableCreator.addHeader(constants.HEADER_USER_USERNAME, 'STRING');
        tableCreator.addHeader(constants.HEADER_USER_USER_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_USER_CREATION_DATE, 'DATE');

        tableCreator.setPrimaryKeys(constants.HEADER_USER_USER_ID);

        return tableCreator.endCreateTable(constants.ENTITIES_USER, initDataGenerator.getInitDataUser())
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createOrganizationTable() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        tableCreator.initCreateTable(constants.ENTITIES_ORGANIZATION);

        tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_NAME, 'STRING');
        tableCreator.addHeader(constants.HEADER_ORGANIZATION_CREATION_DATE, 'DATE');
        tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_TYPE, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_ORGANIZATION_USER_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, 'NUMBER');

        tableCreator.setPrimaryKeys(constants.HEADER_ORGANIZATION_ORGANIZATION_ID,
                                    constants.HEADER_ORGANIZATION_USER_ID);

        return tableCreator.endCreateTable(constants.ENTITIES_ORGANIZATION, initDataGenerator.getInitDataOrganization())
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createFileManagerTable() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        tableCreator.initCreateTable(constants.ENTITIES_FILE_MANAGER);

        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FOLDER_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_NAME, 'STRING');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_MARKDOWN, 'STRING');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_CREATION_DATE, 'DATE');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, 'DATE');
        tableCreator.addHeader(constants.HEADER_FILE_MANAGER_PATH, 'STRING');

        tableCreator.setPrimaryKeys(constants.HEADER_FILE_MANAGER_FILE_ID,
                                    constants.HEADER_FILE_MANAGER_ORGANIZATION_ID);
        return tableCreator.endCreateTable(constants.ENTITIES_FILE_MANAGER, initDataGenerator.getInitDataFileManager())
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createFolderTable() {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        tableCreator.initCreateTable(constants.ENTITIES_FOLDER);

        tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FOLDER_PARENT_FOLDER_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FOLDER_PERMISSION_INDEX, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FOLDER_ORGANIZATION_ID, 'NUMBER');
        tableCreator.addHeader(constants.HEADER_FOLDER_CREATION_DATE, 'DATE');
        tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_NAME, 'STRING');
        tableCreator.addHeader(constants.HEADER_FOLDER_LAST_MODIFIED_DATE, 'DATE');
        tableCreator.addHeader(constants.HEADER_FOLDER_PATH, 'STRING');

        tableCreator.setPrimaryKeys(constants.HEADER_FOLDER_ORGANIZATION_ID,
                                    constants.HEADER_FOLDER_FOLDER_ID);
        return tableCreator.endCreateTable(constants.ENTITIES_FOLDER)
        .then(data => resolve(data))
        .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
  static fillUpDefaultData() {
    if (typeof Promise === 'function') {
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
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
