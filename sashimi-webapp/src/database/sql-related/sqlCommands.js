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
};
