import constants from '../constants';

import SqlCommands from '../sql-related/sqlCommands';

import StringManipulator from '../stringManipulation';

import exceptions from '../exceptions';

const sqlCommands = new SqlCommands();

const stringManipulator = new StringManipulator();

let isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
let sqlCreateTableString = constants.STRING_INITIALIZE;

export default class tableCreator {
  static constructor() {}

  static callSqlToLinkToDatabase() {
    sqlCommands.linkDatabaseToIndexedDB();
  }

  static initCreateTable(tableName) {
    if (isTableInitializedForCreation) {
      throw new exceptions.TableCreationAlreadyInitiated('Table creation is already initiated. '
                                                       + 'Please close the thread first.');
    } else {
      sqlCreateTableString = stringManipulator.stringConcat(tableName, ' (');
      isTableInitializedForCreation = constants.CONST_TABLE_CREATION_INITIALIZED;
    }
  }

  static addHeader(headerName, dataType, ...extraConditions) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, headerName, ' ');
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, dataType);
      for (let index = 0; index < extraConditions.length; index += 1) {
        sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, ' ', extraConditions[index]);
      }
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, ', ');
    }
  }

  static setForeignKey(thisHeader, referencedEntity, referencedHeader) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, 'FOREIGN KEY(', thisHeader, ') ');
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, 'REFERENCES ', referencedEntity);
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, '(', referencedHeader, '), ');
    }
  }

  static setPrimaryKeys(...primaryKeys) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, 'PRIMARY KEY(');
      for (let index = 0; index < primaryKeys.length; index += 1) {
        if (index === primaryKeys.length - 1) {
          sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, primaryKeys[index], '), ');
        } else {
          sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, primaryKeys[index], ', ');
        }
      }
    }
  }

  static setUnique(...uniqueKeys) {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, 'UNIQUE(');
      for (let index = 0; index < uniqueKeys.length; index += 1) {
        if (index === uniqueKeys.length - 1) {
          sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, uniqueKeys[index], '), ');
        } else {
          sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, uniqueKeys[index], ', ');
        }
      }
    }
  }

  static endCreateTable() {
    if (isTableInitializedForCreation) {
      sqlCreateTableString = sqlCreateTableString.substring(0, sqlCreateTableString.length - 2);
      sqlCreateTableString = stringManipulator.stringConcat(sqlCreateTableString, ')');
      isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
      try {
        sqlCommands.createTable(sqlCreateTableString);
      } catch (ExceptionFailedToCreateTable) {
        return ExceptionFailedToCreateTable;
      }
    }
    return constants.PASSED_CREATE_TABLE;
  }

}
