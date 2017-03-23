import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    return sqlCommands.saveFile(fileId, markdownFile);
  }

  static changeFilePath(fileId, newPath) {
    return sqlCommands.changeFilePath(fileId, newPath);
  }

  static changeFileName(fileId, newFileName) {
    return sqlCommands.changeFileName(fileId, newFileName);
  }

  static changeFolderName(folderId, newFolderName) {
    return sqlCommands.changeFolderName(folderId, newFolderName);
  }
}
