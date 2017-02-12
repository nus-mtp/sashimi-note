
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

}
