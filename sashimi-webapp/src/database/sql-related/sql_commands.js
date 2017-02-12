let sql_commands = function(){
    this.get_full_table_data = function(table_name){
    return alasql('SELECT * FROM ' + table_name);
  };
}