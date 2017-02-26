import StringManipulator from '../stringManipulation';

import exceptions from '../exceptions';

import constants from '../constants';

import DateTime from '../generated-data/dateTime';

const alasql = require('alasql');

const stringManipulator = new StringManipulator();

const dateTime = new DateTime();

function getFormattedCurrentDateTime() {
  return stringManipulator.stringConcat('"', dateTime.getCurrentDateTime(), '"');
}

export default function sqlCommands() {
  this.linkDatabaseToIndexedDB = function linkDatabaseToIndexedDB() {
    const databaseRequestStr = "CREATE INDEXEDDB DATABASE IF NOT EXISTS lecture-note-2.0; " +
                               "ATTACH INDEXEDDB DATABASE lecture-note-2.0; " +
                               "USE lecture-note-2.0;";
    Alasql(databaseRequestStr);
  };

  this.getFullTableData = function getFullTableData(tableName) {
    return alasql(stringManipulator.stringConcat('SELECT * FROM ', tableName), callback());
  };

  this.createTable = function createTable(sqlStatement) {
    alasql(stringManipulator.stringConcat('CREATE TABLE IF NOT EXISTS ', sqlStatement), callback());
  };

  this.deleteTable = function deleteTable(tableName) {
    alasql(stringManipulator.stringConcat('DROP TABLE ', tableName), callback());
  };

  this.cleanTable = function cleanTable(tableName) {
    alasql(stringManipulator.stringConcat('DELETE * FROM ', tableName), callback());
  };
}
