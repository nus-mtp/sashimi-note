import StringManipulator from '../StringManipulation';

const Alasql = require('alasql');

const alasql = new Alasql.Database();

const stringManipulator = new StringManipulator();


const callback = function callback() {
  // do nothing??
};

export default function SqlCommands() {
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
