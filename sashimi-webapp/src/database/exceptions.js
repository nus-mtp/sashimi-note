/**
 *
 *  CS3283/4 exceptions.js
 *  This class is to store all the exceptions required for database
 *
 */

export default Object.freeze({
  TableCreationAlreadyInitiated: function TableCreationAlreadyInitiated(message) {
    this.message = message;
    this.name = 'TableCreationAlreadyInitiated';
    this.stack = (new Error()).stack;
  }

});
