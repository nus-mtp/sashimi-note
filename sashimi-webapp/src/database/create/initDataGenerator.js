import SqlArray from 'src/database/generated-data/sqlArray';
import constants from 'src/database/constants';
import DateTime from 'src/database/generated-data/dateTime';

const alasqlArray = new SqlArray();
const dateTime = new DateTime();

export default class initDataGenerator {
  static constructor() {}

  static getInitDataUser() {
    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_USER_TOKEN, 'temporary');
    alasqlArray.addKeyBasePair(constants.HEADER_USER_PASSWORD, '');
    alasqlArray.addKeyBasePair(constants.HEADER_USER_EMAIL, 'default@email.com');
    alasqlArray.addKeyBasePair(constants.HEADER_USER_USERNAME, 'owner');
    alasqlArray.addKeyBasePair(constants.HEADER_USER_USER_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_USER_CREATION_DATE, dateTime.getCurrentDateTime());
    return alasqlArray.endAlasqlArray();
  }

  static getInitDataOrganization() {
    const createdDateTime = dateTime.getCurrentDateTime();
    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_ORGANIZATION_NAME, 'temporary');
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_CREATION_DATE, createdDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_ORGANIZATION_TYPE, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_USER_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, -1);
    return alasqlArray.endAlasqlArray();
  }

  static getInitDataFileManager() {
    const createdDateTime = dateTime.getCurrentDateTime();
    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FOLDER_ID, 0);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_NAME, 'newFile.md');
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_MARKDOWN, '');
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_CREATION_DATE, createdDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, createdDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PATH, '/root/');
    return alasqlArray.endAlasqlArray();
  }

  static getInitDataFolder() {
    const createdDateTime = dateTime.getCurrentDateTime();
    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_FOLDER_ID, 0);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PARENT_FOLDER_ID, -1);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PERMISSION_INDEX, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_ORGANIZATION_ID, 1);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_CREATION_DATE, createdDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_FOLDER_NAME, 'root');
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_LAST_MODIFIED_DATE, createdDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PATH, '/root/');
    return alasqlArray.endAlasqlArray();
  }
}
