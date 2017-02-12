const constants = require('../constants');

const sqlCommands = require('../sql-related/sqlCommands');

const exceptions = require('../exceptions');

let isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
let sqlCreateTableString = constants.STRING_INITIALIZE;

const stringConcat = function stringConcat(...stringToConcat) {
  let fullString = '';
  for (let index = 0; index < stringToConcat.length; index += 1) {
    fullString += stringToConcat[index];
  }
  return fullString;
};

class tableCreator {
  static constructor() { }

  static initCreateTable(tableName) {
    if (isTableInitializedForCreation) {
      throw new exceptions.TableCreationAlreadyInitiated('Table creation is already initiated. Please close the thread first.');
    } else {
      try {
        sqlCommands.getFullTableData(tableName);
        throw new exceptions.TableAlreadyExists('Table already Exist. Not available for creation.');
      } catch (exceptionTableDoesNotExists) {
        sqlCreateTableString = stringConcat('CREATE TABLE ', tableName, '(');
        isTableInitializedForCreation = constants.CONST_TABLE_CREATION_INITIALIZED;
      }
    }
  }

  static addHeader(headerName, dataType, ...extraConditions) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringConcat(sqlCreateTableString, headerName, ' ');
      sqlCreateTableString = stringConcat(sqlCreateTableString, dataType);
      for (let index = 0; index < extraConditions.length; index += 1) {
        sqlCreateTableString = stringConcat(sqlCreateTableString, ' ', extraConditions[index]);
      }
      sqlCreateTableString = stringConcat(sqlCreateTableString, ', ');
    }
  }

  static setForeignKey(thisHeader, referencedEntity, referencedHeader) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringConcat(sqlCreateTableString, 'FOREIGN KEY(', thisHeader, ') ');
      sqlCreateTableString = stringConcat(sqlCreateTableString, 'REFERENCES ', referencedEntity);
      sqlCreateTableString = stringConcat(sqlCreateTableString, '(', referencedHeader, '), ');
    }
  }

}

module.export = tableCreator;
