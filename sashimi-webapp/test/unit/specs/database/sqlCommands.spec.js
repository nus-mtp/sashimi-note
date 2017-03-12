import SqlCommands from 'src/database/sql-related/sqlCommands';
import SqlArray from 'src/database/generated-data/sqlArray';
import dataDelete from 'src/database/data-modifier/dataDelete';
import exceptions from 'src/database/exceptions';

const testDatabaseName = 'test';
const sqlCommands = new SqlCommands();
const alasqlArray = new SqlArray();

function isDatabaseExists(databaseName, callback) {
  const req = indexedDB.open(databaseName);
  let existed = true;
  req.onsuccess = function onSuccess() {
    req.result.close();
    if (!existed) {
      indexedDB.deleteDatabase(databaseName);
    }
    callback(existed);
  };
  req.onupgradeneeded = function onUpgradeNeeded() {
    existed = false;
  };
}

function isTableExistsInDatabase(tableName, callback) {
  const req = indexedDB.open(testDatabaseName);
  req.onsuccess = function onSuccess(event) {
    const tableNames = event.target.result.objectStoreNames;
    if (tableNames.contains(tableName) === false) {
      req.result.close();
      callback(false);
    } else {
      req.result.close();
      callback(true);
    }
  };
  req.onupgradeneeded = function onUpgradeNeeded(event) {
    callback(false);
  };
}


function cleanTestCase() {
  if (typeof Promise === 'function') {
    return new Promise((resolve, reject) =>
      dataDelete.deleteAllEntities(testDatabaseName)
      .then(isDeleted => resolve(isDeleted))
      .catch(sqlErr => reject(sqlErr))
    );
  } else {
    throw new exceptions.PromiseFunctionNotDefined();
  }
}

describe('sqlCommands', () => {
  before(() => {
    sqlCommands.linkDatabaseToIndexedDB(testDatabaseName);
  });

  after(() => {
    cleanTestCase();
  });

  describe('link to indexeddb database', () => {
    it('should link to indexeddb database', (done) => {
      if (!window.indexedDB) {
        done(exceptions.IndexedDBNotSupported);
      }
      sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
      .then(() => {
        const request = window.indexedDB.open(testDatabaseName);
        request.onsuccess = function onsuccess(event) {
          expect(event.target.result).to.not.equal(1);
        };
      }).then(() => {
        cleanTestCase();
        done();
      })
      .catch(err => done(err));
    });
  });

  describe('creation', () => {
    it('should create table', (done) => {
      if (!window.indexedDB) {
        done(exceptions.IndexedDBNotSupported);
      }
      sqlCommands.linkDatabaseToIndexedDB(testDatabaseName) // link to database
      .then(() => { // create table
        const createTableString = 'abc(a NUMBER, b STRING, c DATE)';
        return sqlCommands.createTable(createTableString)
        .then(() => { // test for table exists in database
          const request = window.indexedDB.open(testDatabaseName);
          request.onsuccess = function onsuccess(event) {
            const transaction = request.result.transaction([testDatabaseName], 'read');
            const tableStore = transaction.objectStore(testDatabaseName).get('abc');
            tableStore.onsuccess = function suceed(data) {
              expect(data).to.equal([]);
            };
          };
        }).catch(sqlErr => done(sqlErr));
      }).then(() => {
        cleanTestCase();
        done();
      }).catch(sqlErr => done(sqlErr));
    });
  });
});
