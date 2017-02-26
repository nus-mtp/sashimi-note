/*
 *
 * CS3283/4 - query.js
 * This class deals with query statements for the facade storage
 * This class will communicate with sqlCommands to get a certain command for
 *
 */

import SqlCommands from '../sql-related/sqlCommands';

import exceptions from '../exceptions';

const sqlCommands = new SqlCommands();

export default class query {
  static constructor() {}

  static getFullTableData(tableName) {
    return sqlCommands.getFullTableData(tableName);
  }

  static loadFile(fileId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(() => {
          sqlCommands.loadFile(fileId)
          .then(data => data)
          .catch(sqlError => sqlError);
        });
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

}
