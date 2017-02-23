import StringManipulator from '../StringManipulation';

const Alasql = require('alasql');

const alasql = new Alasql.Database();

const stringManipulator = new StringManipulator();


const callback = function callback() {
  // do nothing??
};

export default function SqlCommands() {
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
