import SqlCommands from 'src/database/sql-related/sqlCommands';
import StringManipulator from 'src/database/stringManipulation';

const sqlCommands = new SqlCommands();
const stringManipulator = new StringManipulator();

function resolveFileSaving(fileContent) {
  return stringManipulator.replaceAll(fileContent, '"', '\\"');
}

export default class dataUpdate {
  static constructor() {}

  static saveFile(fileId, markdownFile) {
    markdownFile = resolveFileSaving(markdownFile);
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
