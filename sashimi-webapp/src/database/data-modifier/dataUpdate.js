import exceptions from '../exceptions';

import SqlCommands from '../sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

function updateFile(fileId, markdownFile) {
  sqlCommands.saveFile(fileId, markdownFile)
  .then(() => true)
  .catch(sqlError => sqlError);
}

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        resolve(updateFile(fileId, markdownFile));
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
