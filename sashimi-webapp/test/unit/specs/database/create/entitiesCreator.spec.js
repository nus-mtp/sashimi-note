import entitiesCreator from 'src/database/create/entitiesCreator';
import dataDelete from 'src/database/data-modifier/dataDelete';
import exceptions from 'src/database/exceptions';
import constants from 'src/database/constants';

import SqlCommands from 'src/database/sql-related/sqlCommands';

const sqlCommands = new SqlCommands();

const testDatabaseName = 'testEntitiesCreator';

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

describe('entitiesCreator', () => {
  before(() =>
    entitiesCreator.initializeDatabase(testDatabaseName)
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
      entitiesCreator.initializeDatabase(testDatabaseName)
      .then(() => {
        isDatabaseExists(testDatabaseName, (isDBExists) => {
          expect(isDBExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });
  });

  describe('creation of table', () => {
    it('should create user table', (done) => {
      if (!window.indexedDB) {
        throw new exceptions.IndexedDBNotSupported();
      }
      entitiesCreator.createUserTable()
      .then(() => {
        isTableExistsInDatabase(constants.ENTITIES_USER, (isTableExists) => {
          expect(isTableExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });

    it('should create organization table', (done) => {
      if (!window.indexedDB) {
        throw new exceptions.IndexedDBNotSupported();
      }
      entitiesCreator.createOrganizationTable()
      .then(() => {
        isTableExistsInDatabase(constants.ENTITIES_ORGANIZATION, (isTableExists) => {
          expect(isTableExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });

    it('should create organization table', (done) => {
      if (!window.indexedDB) {
        throw new exceptions.IndexedDBNotSupported();
      }
      entitiesCreator.createFileManagerTable()
      .then(() => {
        isTableExistsInDatabase(constants.ENTITIES_FILE_MANAGER, (isTableExists) => {
          expect(isTableExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });

    it('should create folder table', (done) => {
      if (!window.indexedDB) {
        throw new exceptions.IndexedDBNotSupported();
      }
      entitiesCreator.createFolderTable()
      .then(() => {
        isTableExistsInDatabase(constants.ENTITIES_FOLDER, (isTableExists) => {
          expect(isTableExists).to.be.true;
          done();
        });
      })
      .catch(err => done(err));
    });
  });

  describe('fill up default data', () => {
    before((done) => { // ensure tables are created first
      entitiesCreator.createFileManagerTable()
      .then(() =>
        entitiesCreator.createFolderTable()
        .catch(sqlErr => done(sqlErr))
      )
      .then(() =>
        entitiesCreator.createOrganizationTable()
        .catch(sqlErr => done(sqlErr))
      )
      .then(() =>
        entitiesCreator.createUserTable()
        .catch(sqlErr => done(sqlErr))
      )
      .then(() =>
        entitiesCreator.fillUpDefaultData()
        .then(isSuccess =>
          // check that function return a pass statement
          expect(isSuccess).to.equal(1)
        )
        .catch(sqlErr => done(sqlErr))
      )
      .then(() => done());
    });

    it('should fill up table with default data', (done) => {
      sqlCommands.getFullTableData(constants.ENTITIES_USER)
      .then((userData) => {
        const creationDate = userData[0].creation_date; // cannot be determined
        return expect(userData).to.deep.equal([{
          token: 'temporary',
          password: '',
          email: 'default@email.com',
          username: 'owner',
          user_id: 1,
          creation_date: creationDate
        }]);
      })
      .then(() => sqlCommands.getFullTableData(constants.ENTITIES_ORGANIZATION)
        .then((organizationData) => {
          const creationDate = organizationData[0].creation_date; // cannot be determined
          return expect(organizationData).to.deep.equal([{
            name: 'temporary',
            creation_date: creationDate,
            organization_index: 1,
            organization_id: 1,
            user_id: 1,
            parent_organization_id: -1
          }]);
        })
      )
      .then(() => sqlCommands.getFullTableData(constants.ENTITIES_FILE_MANAGER)
        .then((fileManagerData) => {
          const creationDate = fileManagerData[0].creation_date; // cannot be determined
          return expect(fileManagerData).to.deep.equal([{
            organization_id: 1,
            folder_id: 0,
            file_id: 1,
            file_name: 'newFile',
            file_markdown: '',
            permission_index: 1,
            creation_date: creationDate,
            last_modified_date: creationDate,
            file_path: '/root/'
          }]);
        })
      )
      .then(() => sqlCommands.getFullTableData(constants.ENTITIES_FOLDER)
        .then((folderData) => {
          const creationDate = folderData[0].creation_date; // cannot be determined
          return expect(folderData).to.deep.equal([{
            folder_id: 0,
            parent_folder_id: -1,
            permission_index: 1,
            organization_id: 1,
            creation_date: creationDate,
            folder_name: 'root',
            last_modified_date: creationDate,
            folder_path: '/root/'
          }]);
        })
      )
      .then(() =>
        done()
      )
      .catch(sqlErr => done(sqlErr));
    }).timeout(10000);
  });
});
