import SqlCommands from 'src/database/sql-related/sqlCommands';
import SqlArray from 'src/database/generated-data/sqlArray';
import StringManipulator from 'src/database/stringManipulation';
import exceptions from 'src/database/exceptions';

const testDatabaseName = 'testSQL';
const sqlCommands = new SqlCommands();
const alasqlArray = new SqlArray();
const stringManipulator = new StringManipulator();

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

function deleteTable(tableNames, databaseName, callback) {
  const thisDatabaseName = databaseName || testDatabaseName;
  const request = indexedDB.open(thisDatabaseName);
  let database = null;

  request.onsuccess = function onSuccess(event) {
    database = request.result;
    database.close();
    callback();
  };

  request.onupgradeneeded = function onUpgradeNeeded(event) {
    database = event.target.result;
    for (let tableToDeleteIndex = 0; tableToDeleteIndex < tableNames.length; tableToDeleteIndex+=1) {
      if (database.objectStoreNames.contains(tableNames[tableToDeleteIndex])) {
        database.deleteObjectStore(tableNames[tableToDeleteIndex]);
      }
    }
  };
}

function deleteDatabase(databaseName) {
  return new Promise((resolve, reject) => {
    const thisDatabaseName = databaseName || testDatabaseName;
    if (!window.indexedDB) {
      reject(exceptions.IndexedDBNotSupported);
    }
    resolve(window.indexedDB.deleteDatabase(thisDatabaseName));
  });
}

function cleanTestCase() {
  return deleteDatabase(testDatabaseName);
}

describe('sqlCommands', () => {
  before(() =>
    sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
  );

  after((done) => {
    cleanTestCase()
    .then(() =>
      done()
    );
  });

  describe('link to indexeddb database', () => {
    it('should link to indexeddb database', (done) => {
      if (!window.indexedDB) {
        throw new exceptions.IndexedDBNotSupported();
      }
      sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
      .then(() => {
        isDatabaseExists(testDatabaseName, (isDBExists) => {
          expect(isDBExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });
  });

  describe('creation', () => {
    after((doneAfter) => {
      const tablesToDelete = ['a', 'b'];
      deleteTable(tablesToDelete, testDatabaseName, () => {
        doneAfter();
      });
    });

    it('should create table', (done) => {
      if (!window.indexedDB) {
        done(exceptions.IndexedDBNotSupported);
      }
      const createTableString = 'a(a NUMBER, b STRING, c DATE)';
      sqlCommands.createTable(createTableString)
      .then(() => { // need to insert something before table exists
        sqlCommands.insertContent('a', [{ a: 123, b: 'hello', c: '2017.03.07 15:52:33' }])
        .catch(sqlErr => done(sqlErr));
      })
      .then(() => { // test for table exists in database
        isTableExistsInDatabase('a', (isTableExist) => {
          expect(isTableExist).to.be.true;
          done();
        });
      })
      .catch(sqlErr => done(sqlErr));
    });

    it('should insert content with correct datatype', (done) => {
      let correctArray;
      let incorrectArray;

      before((doneBefore) => {
        const createTableString = 'b(a NUMBER, b STRING, c DATE)';
        sqlCommands.createTable(createTableString)
        .then(() => { // insert data
          alasqlArray.initializeAlasqlArray();
          alasqlArray.addKeyBasePair('a', 123);
          alasqlArray.addKeyBasePair('b', 'hello string here');
          alasqlArray.addKeyBasePair('c', '2017.03.07 15:52:33');
          correctArray = alasqlArray.endAlasqlArray();
          alasqlArray.initializeAlasqlArray();
          alasqlArray.addKeyBasePair('a', 123);
          alasqlArray.addKeyBasePair('b', '2017.03.07 15:52:33');
          alasqlArray.addKeyBasePair('c', 'hello string here');
          incorrectArray = alasqlArray.endAlasqlArray();
          sqlCommands.insertContent('b', correctArray)
          .then(() => doneBefore())
          .catch(sqlErr => doneBefore(sqlErr));
        })
        .catch(sqlErr => doneBefore(sqlErr));
      });
      sqlCommands.getFullTableData('b')
      .then((data) => {
        expect(data).to.deep.equal(correctArray);
        expect(data).to.not.deep.equal(incorrectArray);
      })
      .then(done())
      .catch(err => done(err));
    }).timeout(20000);
  });

  describe('query', () => {
    const tableName = 'file_manager';
    const firstFile = [{
      organization_id: 1,
      folder_id: 0,
      file_id: 1,
      file_name: 'abcd',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2017.03.07 15:52:33',
      last_modified_date: '2017.03.07 15:52:33',
      file_path: '/root/'
    }];
    const secondFile = [{
      organization_id: 1,
      folder_id: 0,
      file_id: 1,
      file_name: 'abc',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2017.01.09 11:33:12',
      last_modified_date: '2017.01.09 11:33:12',
      file_path: '/root/'
    }];
    const thirdFile = [{
      organization_id: 1,
      folder_id: 0,
      file_id: 1,
      file_name: 'd',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/'
    }];
    const fourthFile = [{
      organization_id: 1,
      folder_id: 0,
      file_id: 1,
      file_name: 'd',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/cross/'
    }];

    it('should get full table data', (done) => {
      let firstArray;
      let secondArray;
      before((doneBefore) => {
        const createTableString = 'c(a NUMBER, b STRING, c DATE)';
        sqlCommands.createTable(createTableString)
        .then(() => { // insert data
          alasqlArray.initializeAlasqlArray();
          alasqlArray.addKeyBasePair('a', 123);
          alasqlArray.addKeyBasePair('b', 'hello string here');
          alasqlArray.addKeyBasePair('c', '2017.03.07 15:52:33');
          firstArray = alasqlArray.endAlasqlArray();
          alasqlArray.initializeAlasqlArray();
          alasqlArray.addKeyBasePair('a', 321);
          alasqlArray.addKeyBasePair('b', 'creating table');
          alasqlArray.addKeyBasePair('c', '1999.12.22 01:22:00');
          secondArray = alasqlArray.endAlasqlArray();
          sqlCommands.insertContent('c', firstArray)
          .then(() => sqlCommands.insertContent('c', secondArray))
          .then(() => doneBefore())
          .catch(sqlErr => doneBefore(sqlErr));
        })
        .catch(sqlErr => doneBefore(sqlErr));
      });
      sqlCommands.getFullTableData('b')
      .then((data) => {
        expect(data).to.deep.equal([firstArray, secondArray]);
        expect(data).to.not.deep.equal([secondArray, firstArray]);
      })
      .then(done())
      .catch(err => done(err));
    });

    it('should be able to partially search a file name', (done) => {
      before((doneBefore) => {
        const createTableString = stringManipulator.stringConcat('file_manager(',
                                  'organization_id NUMBER, ',
                                  'folder_id NUMBER, ',
                                  'file_id NUMBER, ',
                                  'file_name STRING, ',
                                  'file_markdown STRING, ',
                                  'permission_index NUMBER, ',
                                  'creation_date DATE, ',
                                  'last_modified_date DATE,',
                                  'file_path STRING',
                                  ')');
        sqlCommands.createTable(createTableString)
        .then(sqlCommands.insertContent(tableName, firstFile))
        .then(sqlCommands.insertContent(tableName, secondFile))
        .then(sqlCommands.insertContent(tableName, thirdFile))
        .then(doneBefore());
      });

      after(doneAfter =>
        deleteTable([tableName], testDatabaseName, () => {
          doneAfter();
        })
      );
      sqlCommands.partialSearchFileName('abc')
      .then((data) => {
        expect(data).to.deep.equal([firstFile, secondFile]);
      })
      .then(done())
      .catch(err => done(err));
    });

    it('should be able to retrieve all file names in a folder and children folders', (done) => {
      before((doneBefore) => {
        const createTableString = stringManipulator.stringConcat('file_manager(',
                                  'organization_id NUMBER, ',
                                  'folder_id NUMBER, ',
                                  'file_id NUMBER, ',
                                  'file_name STRING, ',
                                  'file_markdown STRING, ',
                                  'permission_index NUMBER, ',
                                  'creation_date DATE, ',
                                  'last_modified_date DATE,',
                                  'file_path STRING',
                                  ')');
        sqlCommands.createTable(createTableString)
        .then(sqlCommands.insertContent(tableName, firstFile))
        .then(sqlCommands.insertContent(tableName, secondFile))
        .then(sqlCommands.insertContent(tableName, thirdFile))
        .then(sqlCommands.insertContent(tableName, fourthFile))
        .then(doneBefore());
      });

      after(doneAfter =>
        deleteTable([tableName], testDatabaseName, () => {
          doneAfter();
        })
      );
      sqlCommands.partialSearchFileName('/root/cross/')
      .then((data) => {
        expect(data).to.deep.equal([fourthFile]);
      })
      .then(() =>
        sqlCommands.partialSearchFileName('/root/')
        .then((data) => {
          expect(data).to.deep.equal([firstFile, secondFile, thirdFile, fourthFile]);
        })
      )
      .then((data) => {
        expect(data).to.deep.equal([fourthFile]);
      })
      .then(done())
      .catch(err => done(err));
    });
  });
});
