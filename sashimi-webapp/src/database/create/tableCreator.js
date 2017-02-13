const constants = require('../constants');

const SqlCommands = require('../sql-related/sqlCommands');

const sqlCommands = new SqlCommands();

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
      throw new exceptions.TableCreationAlreadyInitiated('Table creation is already initiated. '
                                                       + 'Please close the thread first.');
    } else {
      try {
        sqlCommands.getFullTableData(tableName);
        throw new exceptions.TableAlreadyExists('Table already Exist. Not available for creation.');
      } catch (exceptionTableDoesNotExists) {
        sqlCreateTableString = stringConcat('CREATE TABLE ', tableName, ' (');
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

  static setPrimaryKeys(...primaryKeys) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringConcat(sqlCreateTableString, 'PRIMARY KEY(');
      for (let index = 0; index < primaryKeys.length; index += 1) {
        if (index === primaryKeys.length - 1) {
          sqlCreateTableString = stringConcat(sqlCreateTableString, primaryKeys[index], '), ');
        } else {
          sqlCreateTableString = stringConcat(sqlCreateTableString, primaryKeys[index], ', ');
        }
      }
    }
  }

  static setUnique(...uniqueKeys) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringConcat(sqlCreateTableString, 'UNIQUE(');
      for (let index = 0; index < uniqueKeys.length; index += 1) {
        if (index === uniqueKeys.length - 1) {
          sqlCreateTableString = stringConcat(sqlCreateTableString, uniqueKeys[index], '), ');
        } else {
          sqlCreateTableString = stringConcat(sqlCreateTableString, uniqueKeys[index], ', ');
        }
      }
    }
  }

  static endCreateTable() {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = sqlCreateTableString.substring(0, sqlCreateTableString.length - 2);
      sqlCreateTableString = stringConcat(sqlCreateTableString, ')');
      isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
      try {
        sqlCommands.createTable(sqlCreateTableString);
      } catch (ExceptionFailedToCreateTable) {
        return constants.FAILED_CREATE_TABLE;
      }
    }
    return constants.PASSED_CREATE_TABLE;
  }
}

module.export = tableCreator;
