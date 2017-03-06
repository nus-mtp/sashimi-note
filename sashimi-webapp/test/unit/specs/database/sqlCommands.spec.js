import sqlCommands from '../../../../../../database/sql-related/sqlCommands';
import dataDelete from '../../../../../../database/data-modifier/dataDelete';

const testDatabaseName = 'test';

function cleanTestCase() {
  dataDelete.deleteAllEntities(testDatabaseName);
}

describe('sqlCommands', () => {
  describe('link to indexeddb database', () => {
    it('should link to indexeddb database', () => {
      expect(sqlCommands.linkDatabaseToIndexedDB(testDatabaseName)
      .then((data) => {
        const request = window.indexedDB.open(testDatabaseName);
        expect(request.result.version).to.not.equal(1);
      })).to.not.throw(Error);
      cleanTestCase();
    });
  });
});
