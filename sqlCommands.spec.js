import SqlCommands from 'src/database/sql-related/sqlCommands';
import SqlArray from 'src/database/generated-data/sqlArray';
import dataDelete from 'src/database/data-modifier/dataDelete';
import exceptions from 'src/database/exceptions';
import entitiesCreator from 'src/database/create/entitiesCreator';
import constants from 'src/database/constants';

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
        throw new exceptions.IndexedDBNotSupported();
      }
      sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
      .then(() => {
        isDatabaseExists(testDatabaseName, (isDBExists) => {
          /*eslint-disable */
          expect(isDBExists).to.be.true;
          /*eslint-enable */
        });
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
      const createTableString = 'a(a NUMBER, b STRING, c DATE)';
      sqlCommands.createTable(createTableString)
      .then(() => {
        sqlCommands.insertContent('a', [{ a: 123, b: 'hello', c: '2017.03.07 15:52:33' }])
        .catch(sqlErr => done(sqlErr));
      })
      .then(() => { // test for table exists in database
        isTableExistsInDatabase('a', (isTableExist) => {
          /*eslint-disable */
          expect(isTableExist).to.be.true;
          /*eslint-enable */
          done();
        });
      })
      .catch(sqlErr => done(sqlErr));
    });

    it('should insert content with correct datatype', (done) => {
      const createTableString = 'b(a NUMBER, b STRING, c DATE)';
      sqlCommands.createTable(createTableString)
      .then(() => { // insert data
        alasqlArray.initializeAlasqlArray();
        alasqlArray.addKeyBasePair('a', 123);
        alasqlArray.addKeyBasePair('b', 'hello string here');
        alasqlArray.addKeyBasePair('c', '2017.03.07 15:52:33');
        const correctArray = alasqlArray.endAlasqlArray();
        alasqlArray.initializeAlasqlArray();
        alasqlArray.addKeyBasePair('a', 123);
        alasqlArray.addKeyBasePair('b', '2017.03.07 15:52:33');
        alasqlArray.addKeyBasePair('c', 'hello string here');
        const incorrectArray = alasqlArray.endAlasqlArray();
        sqlCommands.insertContent('b', correctArray)
        .then(() =>
          sqlCommands.getFullTableData('b')
          .then((data) => {
            expect(data).to.deep.equal(correctArray);
            expect(data).to.not.deep.equal(incorrectArray);
            done();
          })
          .catch(err => done(err)))
        .catch(sqlErr => done(sqlErr));
      })
      .catch(sqlErr => done(sqlErr));
    }).timeout(10000);
  });

  describe('query', () => {
    it('get full table data', (done) => {
      const createTableString = 'c(a NUMBER, b STRING, c DATE)';
      let firstArray;
      let secondArray;
      sqlCommands.createTable(createTableString)
      .then(() => { // insert data
        alasqlArray.initializeAlasqlArray();
        alasqlArray.addKeyBasePair('a', 123);
        alasqlArray.addKeyBasePair('b', 'hello string here');
        alasqlArray.addKeyBasePair('c', '2017.03.07 15:52:33');
        firstArray = alasqlArray.endAlasqlArray();
        return sqlCommands.insertContent('c', firstArray)
        .catch(sqlErr => done(sqlErr));
      })
      .then(() => { // insert data
        alasqlArray.initializeAlasqlArray();
        alasqlArray.addKeyBasePair('a', 321);
        alasqlArray.addKeyBasePair('b', 'another string here');
        alasqlArray.addKeyBasePair('c', '2017.03.13 14:57:11');
        secondArray = alasqlArray.endAlasqlArray();
        return sqlCommands.insertContent('c', secondArray)
        .catch(sqlErr => done(sqlErr));
      })
      .then(() =>
        sqlCommands.getFullTableData('c')
        .then((data) => {
          expect(data).to.deep.equal([firstArray[0], secondArray[0]]);
          done();
        })
        .catch(err => done(err)))
      .catch(sqlErr => done(sqlErr));
    }).timeout(10000);

    it('return an array of files by partial search name', (done) => {
      const createdDateTime = '2017.03.13 14:57:11';
      alasqlArray.initializeAlasqlArray();
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_ORGANIZATION_ID, 0);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FOLDER_ID, 0);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_ID, 0);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_NAME, 'newFile.md');
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_FILE_MARKDOWN, '');
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PERMISSION_INDEX, 0);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_CREATION_DATE, createdDateTime);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_LAST_MODIFIED_DATE, createdDateTime);
      alasqlArray.addKeyBasePair(constants.HEADER_FILE_MANAGER_PATH, '0');
      const firstData = alasqlArray.endAlasqlArray();

      sqlCommands.partialSearchFileName('fil')
      .then(() =>
        entitiesCreator.createFileManagerTable()
        .then(() => {

        })
        .catch(sqlErr => done(sqlErr))
      )
      .catch(sqlErr => done(sqlErr));
    }).timeout(10000);
  });
});
