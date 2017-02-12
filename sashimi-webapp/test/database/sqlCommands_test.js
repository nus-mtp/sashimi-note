/*
 * Test-unit framework for sqlCommands.js
 */

const assert = require('assert');

const vows = require('vows');

const Sql = require('../../src/database/sql-related/sqlCommands');

const sqlCommands = new Sql();

const isNotEmptyTable = function isNotEmptyTable(stringResult) {
  return stringResult !== undefined;
};

const returnTableToMemory = function(tableData) {
  // do nothing for now
};

const sqlCommandsTest = function sqlCommandsTest() {
  this.testCreateTable = function testCreateTable() {
    let preData = '';
    let isPreDataExists = false;
    try {
      sqlCommands.deleteTable('demo');
    } catch (exceptionTableDoesNotExists) {
      preData = sqlCommands.getFullTableData('demo');
      isPreDataExists = true;
    }
    sqlCommands.createTable('CREATE TABLE demo (paramX INT)');
    const tableData = sqlCommands.getFullTableData('demo');
    assert.isTrue(isNotEmptyTable(tableData));
    sqlCommands.deleteTable('demo');
    if (isPreDataExists) {
      returnTableToMemory(preData);
    }
  };

  this.testCreateTable();
};

module.exports = sqlCommandsTest;

sqlCommandsTest();

/* Failed attempt to test on travis
vows.describe('Test SQL Statements').addBatch({
  'table creation': {
    topic: createTable(),

    'create table': CreateTable(topic) {
      DeleteTable(tableName);
      CreateTable(createTableSql);
      const tableData = sqlCommands.getFullTableData('tableName');
      assert.isNotEmptyTable(tableData);
    }
  }
}).export(module);
*/
