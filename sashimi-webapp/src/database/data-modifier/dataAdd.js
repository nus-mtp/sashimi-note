import exceptions from '../exceptions';
import constants from '../constants';
import SqlCommands from '../sql-related/sqlCommands';
import DateTime from '../generated-data/dateTime';
import SqlArray from '../generated-data/sqlArray';

const sqlCommands = new SqlCommands();
const dateTime = new DateTime();
const alasqlArray = new SqlArray();

function createNewFile(organizationId, filePath, folderId, newFileId) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      const currentDateTime = dateTime.getCurrentDateTime();

      const fileOrganizationId = organizationId;
      const fileFolderId = folderId;
      const fileId = newFileId;
      const fileName = constants.DEFAULT_FILE_NAME;
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
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createNewFolder(organizationId, folderPath, currentFolderId, newFolderId) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      const currentDateTime = dateTime.getCurrentDateTime();

      const folderId = newFolderId;
      const folderParentFolderId = currentFolderId;
      const folderpermissionIndex = constants.PERMISSION_CREATOR;
      const folderOrganizationId = organizationId;
      const folderCreationDate = currentDateTime;
      const folderName = constants.DEFAULT_FOLDER_NAME;
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
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

export default class dataAdd {
  static constructor() {}

  static createNewFile(organizationId, filePath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        // set default new ID if not exist
        sqlCommands.getMaxFileId()
          .then((maxId) => {
            const newFileId = maxId + 1;
            return createNewFile(organizationId, filePath, folderId, newFileId)
            .then(data => resolve(data))
            .catch(err => reject(err));
          }).catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }

  static createNewFolder(organizationId, folderPath, folderId) {
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) =>
        // set default new ID if not exist (already have 0)
        sqlCommands.getMaxFolderId()
        .then((maxId) => {
          const newFolderId = maxId + 1;
          return createNewFolder(organizationId, folderPath, folderId, newFolderId)
            .then(data => resolve(data))
            .catch(err => reject(err));
        }).catch(sqlError => reject(sqlError))
      );
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
  }
}
