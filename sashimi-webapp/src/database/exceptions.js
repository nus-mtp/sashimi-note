/**
 *
 *  CS3283/4 exceptions.js
 *  This class is to store all the exceptions required for database
 *
 */

const exceptions = Object.freeze({

  TableAlreadyExists: function TableAlreadyExists(message) {
    this.message = message;
    this.name = 'Table_Already_Exists';
  },

  TableCreationAlreadyInitiated: function TableCreationAlreadyInitiated(message) {
    this.message = message;
    this.name = 'Table_Creation_Already_Initiated';
  }

});

module.exports = exceptions;
