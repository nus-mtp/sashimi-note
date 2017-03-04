import constants from '../constants';

import SqlCommands from '../sql-related/sqlCommands';

import StringManipulator from '../stringManipulation';

import exceptions from '../exceptions';

const sqlCommands = new SqlCommands();

const stringManipulator = new StringManipulator();

let isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
let sqlCreateTableString = constants.STRING_INITIALIZE;

function endOfCreateTableStringForAlasql(sqlString) {
  sqlString = sqlCreateTableString.substring(0, sqlString.length - 2);
  return stringManipulator.stringConcat(sqlString, ')');
}

export default class tableCreator {
  static constructor() {}

  static callSqlToLinkToDatabase(databaseName) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        const thisDatabaseName = databaseName || 'lectureNote';
        return sqlCommands.linkDatabaseToIndexedDB(thisDatabaseName)
          .then(data => resolve(data))
          .catch(sqlError => reject(sqlError));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  // working
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

  // external library alasql have some bug here. Might need to self implement
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

  static endCreateTable(headerName, alasqlArrayObject) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        if (isTableInitializedForCreation) {
          // remove extra characters to input into alasql
          sqlCreateTableString = endOfCreateTableStringForAlasql(sqlCreateTableString);
          isTableInitializedForCreation = constants.CONST_TABLE_CREATION_CLOSED;
          return sqlCommands.createTable(sqlCreateTableString)
            .then((data) => {
              sqlCommands.insertDefaultArray(headerName, alasqlArrayObject)
                .then(insertSuccess => resolve(insertSuccess))
                .catch(sqlErr => reject(sqlErr));
            })
              .then(data => resolve(constants.PASSED_CREATE_TABLE)
              ).catch(sqlError => reject(sqlError))
            .catch(sqlError => reject(sqlError));
        } else {
          return null;
        }
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

}
