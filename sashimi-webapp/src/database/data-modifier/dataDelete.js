import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataDelete {
  static constructor() {}

  static deleteFile(fileId) {
    return sqlCommands.deleteFile(fileId);
  }


  static deleteFolder(folderId) {
    return sqlCommands.deleteFolder(folderId);
  }
}
