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
