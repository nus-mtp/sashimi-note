import SqlCommands from 'src/database/sql-related/sqlCommands';
import exceptions from 'src/database/exceptions';
import query from 'src/database/retrieve/query';
import StringManipulator from 'src/database/stringManipulation';

const testDatabaseName = 'testQuery';
const sqlCommands = new SqlCommands();
const stringManipulator = new StringManipulator();

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

describe('query', () => {
  const fileTableName = 'file_manager';
  const folderTableName = 'folder';
  const firstFile = [{
    organization_id: 1,
    folder_id: 0,
    file_id: 1,
    file_name: 'abcd',
    file_markdown: '# yes I got my markdown content',
    permission_index: 1,
    creation_date: '2017.03.07 15:52:33',
    last_modified_date: '2017.03.07 15:52:33',
    file_path: '/root/'
  }];
  const secondFile = [{
    organization_id: 1,
    folder_id: 0,
    file_id: 2,
    file_name: 'newFile',
    file_markdown: '',
    permission_index: 1,
    creation_date: 123,
    last_modified_date: 456,
    file_path: '/root/'
  }];
  const rootFolder = [{
    folder_id: 0,
    parent_folder_id: -1,
    organization_id: 1,
    creation_date: 4433,
    folder_name: 'root',
    last_modified_date: 5566,
    folder_path: '/root/'
  }];
  const firstFolder = [{
    folder_id: 1,
    parent_folder_id: 0,
    organization_id: 1,
    creation_date: 4433,
    folder_name: 'newFolder',
    last_modified_date: 5566,
    folder_path: '/root/newFolder/'
  }];
  const createFileTableString = stringManipulator.stringConcat('file_manager(',
                                'organization_id NUMBER, ',
                                'folder_id NUMBER, ',
                                'file_id NUMBER, ',
                                'file_name STRING, ',
                                'file_markdown STRING, ',
                                'permission_index NUMBER, ',
                                'creation_date NUMBER, ',
                                'last_modified_date NUMBER,',
                                'file_path STRING',
                                ')');
  const createFolderTableString = stringManipulator.stringConcat('folder(',
                                  'folder_id NUMBER, ',
                                  'parent_folder_id NUMBER, ',
                                  'organization_id NUMBER, ',
                                  'creation_date NUMBER, ',
                                  'folder_name STRING, ',
                                  'last_modified_date NUMBER, ',
                                  'folder_path STRING',
                                  ')');
  before((doneBefore) => {
    query.initializeDatabase(testDatabaseName)
    .then(() =>
      sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
    )
    .then(() =>
      sqlCommands.createTable(createFileTableString)
    )
    .then(() =>
      sqlCommands.insertContent(fileTableName, firstFile)
    )
    .then(() =>
      sqlCommands.createTable(createFolderTableString)
    )
    .then(() =>
      sqlCommands.insertContent(folderTableName, rootFolder)
    )
    .then(() => {
      doneBefore();
    });
  });

  after((done) => {
    cleanTestCase()
    .then(() =>
      done()
    );
  });
  describe('testing', () => {
    it('should be able to test for non-existence table', (done) => {
      query.isTableExistsInDatabase('abc')
      .then(isExist =>
        expect(isExist).to.equal(false)
      )
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to test for existence table', (done) => {
      query.isTableExistsInDatabase(fileTableName, testDatabaseName)
      .then(isExist =>
        expect(isExist).to.equal(true)
      )
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
  });
  describe('retrieve', () => {
    before((doneBefore) => {
      sqlCommands.insertContent(fileTableName, secondFile)
      .then(() =>
        sqlCommands.insertContent(folderTableName, firstFolder)
      )
      .then(() => {
        doneBefore();
      });
    });
    it('should be able to load all files & folders', (done) => {
      query.getAllFilesAndFolders()
      .then((filesFoldersData) => {
        expect(filesFoldersData).to.deep.equal([[firstFile[0], secondFile[0]],
          [rootFolder[0], firstFolder[0]]]);
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to load all items in a folder', (done) => {
      query.loadFolder(0)
      .then((filesFoldersData) => {
        expect(filesFoldersData).to.deep.equal([[firstFile[0], secondFile[0]],
          [firstFolder[0]]]);
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to load markdown file content', (done) => {
      query.loadFile(1)
      .then((markdownData) => {
        expect(markdownData).to.equal('# yes I got my markdown content');
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to partially search a string', (done) => {
      query.searchString('ew')
      .then((filesFoldersData) => {
        expect(filesFoldersData).to.deep.equal([[secondFile[0]], [firstFolder[0]]]);
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to partially search a string with %', (done) => {
      query.searchString('%b%')
      .then((filesFoldersData) => {
        expect(filesFoldersData).to.deep.equal([[firstFile[0]], []]);
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
    it('should be able to partially search a string with _', (done) => {
      query.searchString('a_c_')
      .then((filesFoldersData) => {
        expect(filesFoldersData).to.deep.equal([[firstFile[0]], []]);
        return '';
      })
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
  });
});
