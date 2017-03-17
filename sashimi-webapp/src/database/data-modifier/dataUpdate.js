import exceptions from 'src/database/exceptions';
import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        sqlCommands.saveFile(fileId, markdownFile)
        .then(() => resolve())
        .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
