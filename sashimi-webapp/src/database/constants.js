/**
 *
 *  CS3283/4 constants.js
 *  This class is to store all the constants required for database
 *
 */

export default Object.freeze({

  ENTITIES_USER: 'user',
  ENTITIES_ORGANIZATION: 'organization',
  ENTITIES_FILE_MANAGER: 'file_manager',
  ENTITIES_FOLDER: 'folder',


  HEADER_USER_TOKEN: 'token',
  HEADER_USER_PASSWORD: 'password',
  HEADER_USER_EMAIL: 'email',
  HEADER_USER_USERNAME: 'username',
  HEADER_USER_USER_ID: 'user_id',
  HEADER_USER_CREATION_DATE: 'creation_date',

  HEADER_ORGANIZATION_ORGANIZATION_NAME: 'name',
  HEADER_ORGANIZATION_CREATION_DATE: 'creation_date',
  HEADER_ORGANIZATION_ORGANIZATION_TYPE: 'organization_index',
  HEADER_ORGANIZATION_ORGANIZATION_ID: 'organization_id',
  HEADER_ORGANIZATION_USER_ID: 'user_id',
  HEADER_ORGANIZATION_PARENT_ORGANIZATION_ID: 'parent_organization_id',

  HEADER_FOLDER_FOLDER_ID: 'folder_id',
  HEADER_FOLDER_PARENT_FOLDER_ID: 'parent_folder_id',
  HEADER_FOLDER_PERMISSION_INDEX: 'permission_index',
  HEADER_FOLDER_ORGANIZATION_ID: 'organization_id',
  HEADER_FOLDER_CREATION_DATE: 'creation_date',
  HEADER_FOLDER_FOLDER_NAME: 'folder_name',
  HEADER_FOLDER_LAST_MODIFIED_DATE: 'last_modified_date',

  HEADER_FILE_MANAGER_ORGANIZATION_ID: 'organization_id',
  HEADER_FILE_MANAGER_FILE_ID: 'file_id',
  HEADER_FILE_MANAGER_FILE_MARKDOWN: 'file_markdown',
  HEADER_FILE_MANAGER_PERMISSION_INDEX: 'permission_index',
  HEADER_FILE_MANAGER_CREATION_DATE: 'creation_date',
  HEADER_FILE_MANAGER_LAST_MODIFIED_DATE: 'last_modified_date',


  STRING_UNDEFINED: 'undefined',
  STRING_INITIALIZE: '',

  CONST_TABLE_CREATION_INITIALIZED: true,
  CONST_TABLE_CREATION_CLOSED: false,

  PASSED_CREATE_TABLE: true,
  FAILED_CREATE_TABLE: false,

  ARRAY_ENTITIES_NAME: ['user', 'organization', 'file_manager', 'folder']
});
