import constants from 'src/database/constants';
import SqlCommands from 'src/database/sql-related/sqlCommands';
import DateTime from 'src/database/generated-data/dateTime';
import SqlArray from 'src/database/generated-data/sqlArray';
import StringManipulator from 'src/database/stringManipulation';

const sqlCommands = new SqlCommands();
const dateTime = new DateTime();
const alasqlArray = new SqlArray();
const stringManipulator = new StringManipulator();

function createNewFile(organizationId, filePath, folderId, newFileId, newFileName) {
  return new Promise((resolve, reject) => {
    const currentDateTime = dateTime.getCurrentDateTime();

    const fileOrganizationId = organizationId;
    const fileFolderId = folderId;
    const fileId = newFileId;
    const fileName = newFileName;
    const fileMarkDown = constants.DEFAULT_EMPTY;
    const filePermission = constants.PERMISSION_CREATOR;
    const fileCreationDateTime = currentDateTime;
    const fileLastModified = fileCreationDateTime;
    const fileThisPath = filePath;

    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, fileOrganizationId);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FOLDER_ID, fileFolderId);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_ID, fileId);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_NAME, fileName);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_MARKDOWN, fileMarkDown);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, filePermission);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_CREATION_DATE, fileCreationDateTime);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, fileLastModified);
    alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PATH, fileThisPath);
    const newFileData = alasqlArray.endAlasqlArray();

    return sqlCommands.insertContent(constants.ENTITIES_FILE_MANAGER, newFileData)
    .then(success => resolve(newFileData[0]))
    .catch(err => reject(err));
  });
}

function createNewFolder(organizationId, folderPath, currentFolderId, newFolderId, newFolderName) {
  return new Promise((resolve, reject) => {
    const currentDateTime = dateTime.getCurrentDateTime();

    const folderId = newFolderId;
    const folderParentFolderId = currentFolderId;
    const folderpermissionIndex = constants.PERMISSION_CREATOR;
    const folderOrganizationId = organizationId;
    const folderCreationDate = currentDateTime;
    const folderName = newFolderName;
    const folderlastModifiedDate = folderCreationDate;
    const folderThisPath = folderPath;

    alasqlArray.initializeAlasqlArray();
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_FOLDER_ID, folderId);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PARENT_FOLDER_ID, folderParentFolderId);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PERMISSION_INDEX, folderpermissionIndex);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_ORGANIZATION_ID, folderOrganizationId);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_CREATION_DATE, folderCreationDate);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_FOLDER_NAME, folderName);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_LAST_MODIFIED_DATE, folderlastModifiedDate);
    alasqlArray.addKeyBasePair(constants.HEADER_FOLDER_PATH, folderThisPath);
    const newFolderData = alasqlArray.endAlasqlArray();

    return sqlCommands.insertContent(constants.ENTITIES_FOLDER, newFolderData)
    .then(success => resolve(newFolderData[0]))
    .catch(err => reject(err));
  });
}

export default class dataAdd {
  static constructor() {}

  static createNewFile(organizationId, filePath, folderId) {
    return new Promise((resolve, reject) =>
      // set default new ID if not exist
      sqlCommands.getMaxFileId()
        .then((maxId) => {
          const newFileId = maxId + 1;
          // search all possible identical fileNames
          return sqlCommands.exactSearchStartFileNameInFolder(filePath)
          .then((queryFiles) => {
            const newFileName = constants.DEFAULT_FILE_NAME;
            return createNewFile(organizationId, filePath, folderId, newFileId, newFileName)
            .then(data => resolve(data))
            .catch(err => reject(err));
          })
          .catch(sqlErr => reject(sqlErr));
        }).catch(sqlError => reject(sqlError))
    );
  }

  static createNewFolder(organizationId, folderPath, folderId) {
    return new Promise((resolve, reject) =>
      // set default new ID if not exist (already have 0)
      sqlCommands.getMaxFolderId()
      .then((maxId) => {
        const newFolderId = maxId + 1;
        // search all possible identical folderNames
        return sqlCommands.exactSearchStartFolderNameInFolder(folderId)
        .then((queryFiles) => {
          const newFolderName = constants.DEFAULT_FOLDER_NAME;
          const newFolderPath = stringManipulator.stringConcat(folderPath, newFolderName, '/');
          return createNewFolder(organizationId, newFolderPath, folderId, newFolderId, newFolderName)
          .then(data => resolve(data))
          .catch(err => reject(err));
        })
        .catch(sqlErr => reject(sqlErr));
      }).catch(sqlError => reject(sqlError))
    );
  }
}
