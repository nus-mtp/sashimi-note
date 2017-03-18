import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    return sqlCommands.saveFile(fileId, markdownFile);
  }
}
