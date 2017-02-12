const alasql = require('alasql');

const stringConcat = function(...stringToConcat) {
  let fullString = '';
  for (let index = 0; index < stringToConcat.length; index+=1) {
    fullString += stringToConcat[index];
  }
  return fullString;
};

const sqlCommands = function() {
  this.get_full_table_data = function(tableName) {
    return alasql(stringConcat('SELECT * FROM ', tableName));
  };
};

