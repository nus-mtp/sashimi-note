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
    const databaseRequestStr = "CREATE INDEXEDDB DATABASE IF NOT EXISTS lectureNote; " +
                               "ATTACH INDEXEDDB DATABASE lectureNote; " +
                               "USE lectureNote;";
    alasql.promise([databaseRequestStr])
      .then().catch(sqlError => sqlError);
  };

  this.getFullTableData = function getFullTableData(tableName) {
    // ensure working in browsers that support Promise
    if (typeof Promise === 'function') {
      return new Promise((resolve, reject) => {
        alasql.promise([stringManipulator.stringConcat('SELECT * FROM ', tableName)])
          .then(data => resolve(data))
          .catch(sqlError => sqlError);
      });
    } else {
      throw new exceptions.PromiseFunctionNotDefined();
    }
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
