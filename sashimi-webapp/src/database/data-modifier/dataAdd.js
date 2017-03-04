import exceptions from '../exceptions';

import constants from '../constants';

import SqlCommands from '../sql-related/sqlCommands';

import DateTime from '../generated-data/dateTime';

import StringManipulator from '../stringManipulation';

const sqlCommands = new SqlCommands();
const dateTime = new DateTime();
const stringManipulator = new StringManipulator();

function getFormattedCurrentDateTime() {
  return stringManipulator.stringConcat('"', dateTime.getCurrentDateTime(), '"');
}

function createNewFile(organizationId, filePath, folderId, newFileId) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      const thisOrganizationId = organizationId;
      const thisFolderId = folderId;
      const fileId = newFileId;
      const fileName = constants.DEFAULT_FILE_NAME;
      const fileMarkDown = '""';
      const filePermission = constants.PERMISSION_CREATOR;
      const fileCreationDate = getFormattedCurrentDateTime();
      const fileLastModified = fileCreationDate;
      const fileNewPath = stringManipulator.stringConcat('"', filePath, '"');

      return sqlCommands.insertContent(constants.ENTITIES_FILE_MANAGER,
                                thisOrganizationId,
                                thisFolderId,
                                fileId,
                                fileName,
                                fileMarkDown,
                                filePermission,
                                fileCreationDate,
                                fileLastModified,
                                fileNewPath)
      .then(data => resolve(data))
      .catch(err => reject(err));
    });
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

function createNewFolder(organizationId, folderPath, currentFolderId, newFolderId) {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) => {
      const formattedCurrentDateTime = getFormattedCurrentDateTime();

      const folderId = newFolderId;
      const parentFolderId = currentFolderId;
      const permissionIndex = constants.PERMISSION_CREATOR;
      const thisOrganizationId = organizationId;
      const creationDate = formattedCurrentDateTime;
      const folderName = constants.DEFAULT_FOLDER_NAME;
      const lastModifiedDate = creationDate;
      const thisFolderPath = folderPath;

      return sqlCommands.insertContent(constants.ENTITIES_FOLDER,
                                folderId,
                                parentFolderId,
                                permissionIndex,
                                thisOrganizationId,
                                creationDate,
                                folderName,
                                lastModifiedDate,
                                thisFolderPath)
      .then(data => resolve(true))
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
