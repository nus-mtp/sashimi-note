import SqlCommands from 'src/database/sql-related/sqlCommands';
import SqlArray from 'src/database/generated-data/sqlArray';
import StringManipulator from 'src/database/stringManipulation';
import exceptions from 'src/database/exceptions';
import defaultFeatureFile from 'src/../static/data/features.txt';

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
  before((done) => {
    sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
    .then(() => {
      done();
    });
  });

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
    it('should create table', (done) => {
      const createTableString = 'a(a NUMBER, b STRING, c DATE)';
      sqlCommands.createTable(createTableString)
      .then(() =>  // need to insert something before table exists
         sqlCommands.insertContent('a', [{ a: 123, b: 'hello', c: '2017.03.07 15:52:33' }])
        // .catch(sqlErr => done(sqlErr));
      )
      .then(() => { // test for table exists in database
        isTableExistsInDatabase('a', (isTableExist) => {
          expect(isTableExist).to.be.true;
          done();
        });
      })
      .catch(sqlErr => done(sqlErr));
    });

    describe('data-filling', () => {
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

      const createTableString = 'b(a NUMBER, b STRING, c DATE)';

      before((doneBefore) => {
        sqlCommands.createTable(createTableString)
        .then(() =>
          sqlCommands.insertContent('b', correctArray)
          .then(() => {
            doneBefore();
          })
        )
        .catch(sqlErr => doneBefore(sqlErr));
      });

      it('should insert content with correct datatype', (done) => {
        sqlCommands.getFullTableData('b')
        .then((data) => {
          expect(data).to.deep.equal(correctArray);
          expect(data).to.not.deep.equal(incorrectArray);
        })
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
      }).timeout(20000);
    });
  });

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
      file_id: 3,
      file_name: 'd',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/'
    }];
    const fourthFile = [{
      organization_id: 1,
      folder_id: 6,
      file_id: 4,
      file_name: 'd',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/cross/'
    }];
    const fifthFile = [{
      organization_id: 1,
      folder_id: 6,
      file_id: 5,
      file_name: 'miserable',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/cross/'
    }];
    const sixthFile = [{
      organization_id: 1,
      folder_id: 7,
      file_id: 6,
      file_name: 'kirby',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/cross/lovely photos/'
    }];
    const seventhFile = [{
      organization_id: 1,
      folder_id: 5,
      file_id: 7,
      file_name: 'old',
      file_markdown: '',
      permission_index: 1,
      creation_date: '2015.01.09 11:33:12',
      last_modified_date: '2015.01.09 11:33:12',
      file_path: '/root/random/root/consume/'
    }];
    const rootFolder = [{
      folder_id: 0,
      parent_folder_id: -1,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'root',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/'
    }];
    const firstFolder = [{
      folder_id: 1,
      parent_folder_id: 0,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'documentary',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/documentary/'
    }];
    const secondFolder = [{
      folder_id: 2,
      parent_folder_id: 0,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'random',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/random/'
    }];
    const thirdFolder = [{
      folder_id: 3,
      parent_folder_id: 2,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'root',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/random/root/'
    }];
    const fourthFolder = [{
      folder_id: 4,
      parent_folder_id: 2,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'drawings',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/random/drawings/'
    }];
    const fifthFolder = [{
      folder_id: 5,
      parent_folder_id: 3,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'consume',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/random/root/consume/'
    }];
    const sixthFolder = [{
      folder_id: 6,
      parent_folder_id: 0,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'cross',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/cross/'
    }];
    const seventhFolder = [{
      folder_id: 7,
      parent_folder_id: 6,
      organization_id: 1,
      creation_date: '2015.01.09 11:33:12',
      folder_name: 'lovely photos',
      last_modified_date: '2015.01.09 11:33:12',
      folder_path: '/root/cross/lovely photos/'
    }];

    describe('getFullTableData', () => {
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
          alasqlArray.addKeyBasePair('c', '1999.12.11 01:22:00');
          secondArray = alasqlArray.endAlasqlArray();
          return sqlCommands.insertContent('c', firstArray)
          .then(() =>
            sqlCommands.insertContent('c', secondArray))
          .catch(sqlErr => doneBefore(sqlErr));
        })
        .then(() => {
          doneBefore();
        })
        .catch(sqlErr => doneBefore(sqlErr));
      });

      it('should get full table data', (done) => {
        sqlCommands.getFullTableData('c')
        .then((data) => {
          expect(data).to.deep.equal([firstArray[0], secondArray[0]]);
          expect(data).to.not.deep.equal([secondArray[0], firstArray[0]]);
          return '';
        })
        .then(() => {
          done();
        })
        .catch(err => done(err));
      });
    });

    describe('Database related stuffs', () => {
      before((doneBefore) => {
        const createFileTableString = stringManipulator.stringConcat('file_manager(',
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
        sqlCommands.createTable(createFileTableString)
        .then(() =>
          sqlCommands.insertContent(fileTableName, firstFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, secondFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, thirdFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, fourthFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, fifthFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, sixthFile)
        )
        .then(() =>
          sqlCommands.insertContent(fileTableName, seventhFile)
        )
        .then(() => {
          doneBefore();
        });
      });

      before((doneBefore) => {
        const createFolderTableString = stringManipulator.stringConcat('folder(',
                                        'folder_id NUMBER, ',
                                        'parent_folder_id NUMBER, ',
                                        'organization_id NUMBER, ',
                                        'creation_date DATE, ',
                                        'folder_name STRING, ',
                                        'last_modified_date DATE, ',
                                        'folder_path STRING',
                                        ')');

        sqlCommands.createTable(createFolderTableString)
        .then(() =>
          sqlCommands.insertContent(folderTableName, rootFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, firstFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, secondFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, thirdFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, fourthFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, fifthFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, sixthFolder)
        )
        .then(() =>
          sqlCommands.insertContent(folderTableName, seventhFolder)
        )
        .then(() => {
          doneBefore();
        });
      });

      describe('partial-search file name', () => {
        it('should be able to partially search a file name', (done) => {
          sqlCommands.partialSearchFileName('cd')
          .then(data =>
            expect(data).to.deep.equal([firstFile[0]])
          )
          .then(() =>
            sqlCommands.partialSearchFileName('abc')
            .then((data) => {
              expect(data).to.deep.equal([firstFile[0], secondFile[0]]);
            })
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('get all file names from this folder', () => {
        it('should be able to retrieve all file names in a folder and children folders', (done) => {
          sqlCommands.exactSearchStartFileNameInFolder('/root/')
          .then(data =>
            expect(data).to.deep.equal([{ file_name: 'abc' },
                                        { file_name: 'abcd' },
                                        { file_name: 'd' },
                                        { file_name: 'd' },
                                        { file_name: 'kirby' },
                                        { file_name: 'miserable' },
                                        { file_name: 'old' }])
          )
          .then(() =>
            sqlCommands.exactSearchStartFileNameInFolder('/root/cross/')
            .then(data =>
              expect(data).to.deep.equal([{ file_name: 'd' },
                                          { file_name: 'kirby' },
                                          { file_name: 'miserable' }]))
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('get all folders', () => {
        it('should be able to retrieve all folders in a folder and children folders', (done) => {
          sqlCommands.loadFoldersFromFolder(0)
          .then(data =>
            expect(data).to.deep.equal([sixthFolder[0], firstFolder[0], secondFolder[0]])
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('counter max id', () => {
        it('should be able to get maximum file ID', (done) => {
          sqlCommands.getMaxFileId()
          .then(data =>
            expect(data).to.equal(7)
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('should be able to get maximum folder ID', (done) => {
          sqlCommands.getMaxFolderId()
          .then(data =>
            expect(data).to.equal(7)
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('getting complete file/folder data', () => {
        it('should be able to retrieve full file', (done) => {
          sqlCommands.retrieveFullFile(1)
          .then(data =>
            expect(data).to.deep.equal(firstFile)
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('get list of folders from partial name', (done) => {
          sqlCommands.partialSearchFolderName('oo')
          .then(data =>
            expect(data).to.deep.equal([rootFolder[0], thirdFolder[0]])
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('get list of files in file', (done) => {
          sqlCommands.loadFilesFromFolder(0)
          .then(data =>
            expect(data).to.deep.equal([firstFile[0], secondFile[0], thirdFile[0]])
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('get markdown file', () => {
        it('should be able to retrieve a stored markdown file', (done) => {
          sqlCommands.loadFile(1)
          .then(data =>
            expect(data).to.equal('# yes I got my markdown content')
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('changing names', () => {
        it('should change file name', (done) => {
          const editedFile = seventhFile[0];
          editedFile.file_name = 'new';
          sqlCommands.changeFileName(7, 'new')
          .then(() =>
            sqlCommands.loadFilesFromFolder(5)
            .then(filesData =>
              expect(filesData).to.deep.equal([editedFile])
            )
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('throw an exception for invalid file name', (done) => {
          sqlCommands.changeFileName(7, '"')
          .catch(sqlErr =>
            expect(sqlErr.name).to.equal('InvalidRename')
          )
          .then(() =>
            sqlCommands.changeFileName(7, '\\')
          )
          .catch(sqlErr =>
            expect(sqlErr.name).to.equal('InvalidRename')
          )
          .then(() => {
            done();
          })
          .catch(err => done(err))
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('throw an exception for invalid folder name', (done) => {
          sqlCommands.changeFolderName(6, '"')
          .catch(sqlErr =>
            expect(sqlErr.name).to.equal('InvalidRename')
          )
          .then(() =>
            sqlCommands.changeFolderName(6, '\\')
          )
          .catch(sqlErr =>
            expect(sqlErr.name).to.equal('InvalidRename')
          )
          .then(() => {
            done();
          })
          .catch(err => done(err))
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
        it('should change folder name', (done) => {
          const editedSixthFolder = sixthFolder[0];
          const editedSeventhFolder = seventhFolder[0];
          const editedSixthFile = sixthFile[0];
          editedSixthFolder.folder_name = 'newFolder';
          editedSixthFolder.folder_path = '/root/newFolder/';
          editedSeventhFolder.folder_path = '/root/newFolder/lovely photos/';
          editedSixthFile.file_path = '/root/newFolder/lovely photos/';
          sqlCommands.changeFolderName(6, 'newFolder')
          .then(() =>
            sqlCommands.loadFilesFromFolder(7)
            .then(filesData =>
              expect(filesData).to.deep.equal([editedSixthFile])
            )
          )
          .then(() =>
            sqlCommands.loadFoldersFromFolder(6)
            .then(foldersData =>
              expect(foldersData).to.deep.equal([editedSeventhFolder])
            )
          )
          .then(() =>
            sqlCommands.loadFoldersFromFolder(0)
            .then(foldersData =>
              expect(foldersData).to.deep.equal([firstFolder[0], editedSixthFolder, secondFolder[0]])
            )
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('changing path', () => {
        it('should change file path', (done) => {
          const editedFile = thirdFile[0];
          editedFile.file_path = '/root/documentary/';
          editedFile.folder_id = 1;
          sqlCommands.changeFilePath(3, '/root/documentary/')
          .then(() =>
            sqlCommands.loadFilesFromFolder(1)
            .then(filesData =>
              expect(filesData).to.deep.equal([editedFile])
            )
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });

      describe('save content', () => {
        it('save markdown file', (done) => {
          sqlCommands.saveFile(3, defaultFeatureFile)
          .then(() =>
            sqlCommands.loadFile(3)
            .then((markdownFile) => {
              markdownFile = stringManipulator.revertSQLInjections(markdownFile);
              expect(markdownFile).to.deep.equal(defaultFeatureFile);
            })
          )
          .then(() => {
            done();
          })
          .catch(err => done(err));
        });
      });
    });

    describe('deleting', () => {
      it('delete file', (done) => {
        sqlCommands.deleteFile(6)
        .then(() =>
          sqlCommands.loadFilesFromFolder(7)
          .then(filesData =>
            expect(filesData).to.deep.equal([])
          )
        )
        .then(() => {
          done();
        })
        .catch(err => done(err));
      });
      it('delete folder', (done) => {
        sqlCommands.deleteFolder(6)
        .then(() =>
          sqlCommands.loadFoldersFromFolder(0)
          .then(foldersData =>
            expect(foldersData).to.deep.equal([firstFolder[0], secondFolder[0]])
          )
        )
        .then(() => {
          done();
        })
        .catch(err => done(err));
      });
    });
  });
});
