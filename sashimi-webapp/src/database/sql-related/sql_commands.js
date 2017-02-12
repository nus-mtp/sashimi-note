const sqlCommands = function() {
  this.get_full_table_data = function(tableName) {
    return alasql(stringConcat('SELECT * FROM ', tableName));
  };
};
