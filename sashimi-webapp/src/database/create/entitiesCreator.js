import constants from '../constants';
import tableCreator from './tableCreator';

export default class entitiesCreator {

  static constuctor() {}

  static initializeDatabase() {
    tableCreator.callSqlToLinkToDatabase();
  }

  static createUserTable() {
    tableCreator.initCreateTable(constants.ENTITIES_USER);

    tableCreator.addHeader(constants.HEADER_USER_TOKEN, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_PASSWORD, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_EMAIL, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_USERNAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_USER_USER_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_USER_CREATION_DATE, 'DATE');

    tableCreator.setPrimaryKeys(constants.HEADER_USER_USER_ID);

    const isTableCreatedSuccessful = tableCreator.endCreateTable();

    }

    return isTableCreatedSuccessful;
  }

  static createOrganizationTable() {
    tableCreator.initCreateTable(constants.ENTITIES_ORGANIZATION);

    tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_NAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_CREATION_DATE, 'DATE');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_INDEX, 'INT');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_USER_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, 'LONG');

    tableCreator.setForeignKey(constants.HEADER_ORGANIZATION_USER_ID,
                                 constants.ENTITIES_USER,
                                 constants.HEADER_USER_USER_ID);
    /* tableCreator.setForeignKey(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID,
                                 constants.ENTITIES_ORGANIZATION,
                                 constants.HEADER_ORGANIZATION_ORGANIZATION_ID);*/

    tableCreator.setPrimaryKeys(constants.HEADER_ORGANIZATION_ORGANIZATION_ID,
                                  constants.HEADER_ORGANIZATION_USER_ID);

    const isTableCreatedSuccessful = tableCreator.endCreateTable();

    }

    return isTableCreatedSuccessful;
  }

  static createFileManagerTable() {
    tableCreator.initCreateTable(constants.ENTITIES_FILE_MANAGER);

    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_FILE_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, 'INT');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_CREATION_DATE, 'DATE');
    tableCreator.addHeader(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, 'DATE');

    tableCreator.setForeignKey(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID,
                                 constants.ENTITIES_ORGANIZATION,
                                 constants.HEADER_ORGANIZATION_ORGANIZATION_ID);

    tableCreator.setPrimaryKeys(constants.HEADER_FILE_MANAGER_FILE_ID,
                                  constants.HEADER_FILE_MANAGER_ORGANIZATION_ID);

    const isTableCreatedSuccessful = tableCreator.endCreateTable();

    }

    return isTableCreatedSuccessful;
  }

  static createFolderTable() {
    tableCreator.initCreateTable(constants.ENTITIES_FOLDER);

    tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_FOLDER_PARENT_FOLDER_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_FOLDER_PERMISSION_INDEX, 'INT');
    tableCreator.addHeader(constants.HEADER_FOLDER_ORGANIZATION_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_FOLDER_CREATION_DATE, 'DATE');
    tableCreator.addHeader(constants.HEADER_FOLDER_FOLDER_NAME, 'STRING');
    tableCreator.addHeader(constants.HEADER_FOLDER_LAST_MODIFIED_DATE, 'DATE');

    tableCreator.setForeignKey(constants.HEADER_FOLDER_PARENT_FOLDER_ID,
                                 constants.ENTITIES_FOLDER,
                                 constants.HEADER_FOLDER_FOLDER_ID);
    tableCreator.setForeignKey(constants.HEADER_FOLDER_ORGANIZATION_ID,
                                 constants.ENTITIES_ORGANIZATION,
                                 constants.HEADER_ORGANIZATION_ORGANIZATION_ID);

    tableCreator.setPrimaryKeys(constants.HEADER_ORGANIZATION_ORGANIZATION_ID,
                                  constants.HEADER_ORGANIZATION_USER_ID);
    const isTableCreatedSuccessful = tableCreator.endCreateTable();

    }

    return isTableCreatedSuccessful;
  }

  static clearDatabase() {
    tableCreator.clearDatabase();
  }
};

