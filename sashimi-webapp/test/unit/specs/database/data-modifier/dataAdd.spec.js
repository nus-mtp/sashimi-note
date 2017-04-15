import SqlCommands from 'src/database/sql-related/sqlCommands';
import exceptions from 'src/database/exceptions';
import dataAdd from 'src/database/data-modifier/dataAdd';
import StringManipulator from 'src/database/stringManipulation';

const testDatabaseName = 'testDataAdd';
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

describe('dataAdd', () => {
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
  const thirdFile = [{
    organization_id: 1,
    folder_id: 0,
    file_id: 3,
    file_name: 'copy of abcd',
    file_markdown: '# yes I got my markdown content',
    permission_index: 1,
    creation_date: '2017.03.07 15:52:33',
    last_modified_date: '2017.03.07 15:52:33',
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
    sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
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
  describe('creation', () => {
    it('should be able to create a new file', (done) => {
      dataAdd.createNewFile(1, '/root/', 0)
      .then(() =>
        sqlCommands.getMaxFileId()
        .then(maxFileId =>
          expect(maxFileId).to.equal(2)
        )
      )
      .then(() =>
        sqlCommands.loadFilesFromFolder(0)
        .then((filesData) => {
          // exact dates cannot be determined
          secondFile[0].creation_date = filesData[1].creation_date;
          secondFile[0].last_modified_date = filesData[1].last_modified_date;
          expect(filesData).to.deep.equal([firstFile[0], secondFile[0]]);
        })
      )
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });

    it('should be able to create a new folder', (done) => {
      dataAdd.createNewFolder(1, '/root/', 0)
      .then(() =>
        sqlCommands.getMaxFolderId()
        .then(maxFileId =>
          expect(maxFileId).to.equal(1)
        )
      )
      .then(() =>
        sqlCommands.loadFoldersFromFolder(0)
        .then((foldersData) => {
          // exact dates cannot be determined
          firstFolder[0].creation_date = foldersData[0].creation_date;
          firstFolder[0].last_modified_date = foldersData[0].last_modified_date;
          expect(foldersData).to.deep.equal([firstFolder[0]]);
        })
      )
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
  });

  describe('duplication', () => {
    it('should be able to create a new folder', (done) => {
      dataAdd.duplicateFile(1)
      .then(() =>
        sqlCommands.loadFilesFromFolder(0)
        .then((filesData) => {
          // exact dates cannot be determined
          secondFile[0].creation_date = filesData[1].creation_date;
          secondFile[0].last_modified_date = filesData[1].last_modified_date;
          expect(filesData).to.deep.not.equal([firstFile[0], secondFile[0], thirdFile]);
          thirdFile[0].creation_date = filesData[2].creation_date;
          thirdFile[0].last_modified_date = filesData[2].last_modified_date;
          expect(filesData).to.deep.equal([firstFile[0], secondFile[0], thirdFile[0]]);
          return '';
        })
        .catch(sqlErr => done(sqlErr))
      )
      .then(() => {
        done();
      })
      .catch(sqlErr => done(sqlErr));
    });
  });
});
