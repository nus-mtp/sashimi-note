const alasql = require('alasql');

const stringConcat = function stringConcat(...stringToConcat) {
  let fullString = '';
  for (let index = 0; index < stringToConcat.length; index+=1) {
    fullString += stringToConcat[index];
  }
  return fullString;
};

const sqlCommands = function sqlCommands() {
  this.getFullTableData = function getFullTableData(tableName) {
    return alasql(stringConcat('SELECT * FROM ', tableName));
  };

  this.createTable = function createTable(sqlStatement) {
    alasql(sqlStatement);
  };

  this.deleteTable = function deleteTable(tableName) {
    alasql(stringConcat('DROP TABLE ', tableName));
  };

  this.cleanTable = function cleanTable(tableName) {
    alasql(stringConcat('DELETE * FROM ', tableName));
  };

  // for debugging
  this.clearDatabase = function clearDatabase() {
    alasql(stringConcat('DROP TABLE *'));
  };
};

module.exports = sqlCommands;
