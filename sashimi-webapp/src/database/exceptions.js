/**
 *
 *  CS3283/4 exceptions.js
 *  This class is to store all the exceptions required for database
 *
 */

export default Object.freeze({
  TableCreationAlreadyInitiated: function TableCreationAlreadyInitiated(message) {
    this.message = message || 'Exception: table creation thread is not closed.';
    this.name = 'TableCreationAlreadyInitiated';
    this.stack = (new Error()).stack;
  },

  IllegalAccessToUserTable: function IllegalAccessToUserTable(message) {
    this.message = message || 'Exception: user table does not exist.';
    this.name = 'IllegalAccessToUserTable';
    this.stack = (new Error()).stack;
  },

  IllegalAccessToOrganizationTable: function IllegalAccessToOrganizationTable(message) {
    this.message = message || 'Exception: organization table does not exist.';
    this.name = 'IllegalAccessToOrganizationTable';
    this.stack = (new Error()).stack;
  },

  IllegalAccessToFolderTable: function IllegalAccessToFolderTable(message) {
    this.message = message || 'Exception: folder table does not exist.';
    this.name = 'IllegalAccessToFolderTable';
    this.stack = (new Error()).stack;
  },

  PromiseFunctionNotDefined: function PromiseFunctionNotDefined(message) {
    this.message = message || 'Exception: Promise function not defined for this browser.';
    this.name = 'PromiseFunctionNotDefined';
    this.stack = (new Error()).stack;
  },

  IndexedDBNotSupported: function IndexedDBNotSupported(message) {
    this.message = message || 'Exception: IndexedDB not supported on this browser.';
    this.name = 'IndexedDBNotSupported';
    this.stack = (new Error()).stack;
  }
});
