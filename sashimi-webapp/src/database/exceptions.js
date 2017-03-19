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

  IndexedDBNotSupported: function IndexedDBNotSupported(message) {
    this.message = message || 'Exception: IndexedDB not supported on this browser.';
    this.name = 'IndexedDBNotSupported';
    this.stack = (new Error()).stack;
  },

  IndexedDBOnBlock: function IndexedDBOnBlock(message) {
    this.message = message || 'Exception: IndexedDB thread blocked.';
    this.name = 'IndexedDBOnBlock';
    this.stack = (new Error()).stack;
  }
});
