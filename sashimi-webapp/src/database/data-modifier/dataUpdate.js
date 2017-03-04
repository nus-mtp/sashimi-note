import exceptions from '../exceptions';

import SqlCommands from '../sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

function updateFile(fileId, markdownFile) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      sqlCommands.saveFile(fileId, markdownFile)
        .then(data => true)
        .catch(sqlError => sqlError)
      );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        resolve(updateFile(fileId, markdownFile))
          .then(data => resolve(data))
          .catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
