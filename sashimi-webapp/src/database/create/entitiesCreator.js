
const constants = require('../constants');

const tableCreator = require('./tableCreator');

const alasql = require('alasql');

const debugActivated = constants.DEBUG_ON;

const stringConcat = function stringConcat(...stringToConcat) {
  let fullString = '';
  for (let index = 0; index < stringToConcat.length; index+=1) {
    fullString += stringToConcat[index];
  }
  return fullString;
};

class entitiesCreator {

  static constuctor() {}

  static createUserTable() {
    tableCreator.initCreateTable(constants.ENTITIES_USER);

    tableCreator.addHeader(constants.HEADER_USER_TOKEN, 'VARCHAR(128)');
    tableCreator.addHeader(constants.HEADER_USER_PASSWORD, 'VARCHAR(64)');
    tableCreator.addHeader(constants.HEADER_USER_EMAIL, 'VARCHAR(128)');
    tableCreator.addHeader(constants.HEADER_USER_USERNAME, 'VARCHAR(32)');
    tableCreator.addHeader(constants.HEADER_USER_USER_ID, 'LONG');
    tableCreator.addHeader(constants.HEADER_USER_USER_CREATION_DATE, 'DATE');

    tableCreator.setPrimaryKeys(constants.HEADER_USER_USER_ID);

    const isTableCreatedSuccessful = tableCreator.end_create_table();

    if (debugActivated) {
      const debugUserTable = alasql(stringConcat('SELECT * FROM ', constants.ENTITIES_USER));
      console.log('DEBUG user table:');
      console.log(debugUserTable);
    }

    return isTableCreatedSuccessful;
  }

  static createOrganizationTable() {
    tableCreator.init_create_table(constants.ENTITIES_ORGANIZATION);

    tableCreator.add_header(constants.HEADER_ORGANIZATION_ORGANIZATION_NAME, 'VARCHAR(64)');
    tableCreator.add_header(constants.HEADER_ORGANIZATION_CREATION_DATE, 'DATE');
    tableCreator.add_header(constants.HEADER_ORGANIZATION_INDEX, 'INT');
    tableCreator.add_header(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, 'LONG');
    tableCreator.add_header(constants.HEADER_ORGANIZATION_USER_ID, 'LONG');
    tableCreator.add_header(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, 'LONG');

    tableCreator.set_foreign_key(constants.HEADER_ORGANIZATION_USER_ID, constants.ENTITIES_USER, constants.HEADER_USER_USER_ID);
    tableCreator.set_foreign_key(constants.HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID, constants.ENTITIES_ORGANIZATION, constants.HEADER_ORGANIZATION_ORGANIZATION_ID);

    tableCreator.set_primary_keys(constants.HEADER_ORGANIZATION_ORGANIZATION_ID, constants.HEADER_ORGANIZATION_USER_ID);

    const isTableCreatedSuccessful = tableCreator.end_create_table();

    if (debugActivated) {
      const debugOrganizationTable = alasql(stringConcat('SELECT * FROM ', constants.ENTITIES_ORGANIZATION));
      console.log('DEBUG organization table:');
      console.log(debugOrganizationTable);
    }
}
