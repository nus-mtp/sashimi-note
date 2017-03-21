import initDataGenerator from 'src/database/create/initDataGenerator';

describe('initDataGenerator', () => {
  describe('generate correct default data', () => {
    it('should create default userData', (done) => {
      const userData = initDataGenerator.getInitDataUser();
      const creationDate = userData[0].creation_date; // can't be determined
      expect(userData).to.deep.equal([{
        token: 'temporary',
        password: '',
        email: 'default@email.com',
        username: 'owner',
        user_id: 1,
        creation_date: creationDate
      }]);
      done();
    });

    it('should create default organizationData', (done) => {
      const userData = initDataGenerator.getInitDataOrganization();
      const creationDate = userData[0].creation_date; // can't be determined
      expect(userData).to.deep.equal([{
        name: 'temporary',
        creation_date: creationDate,
        organization_index: 1,
        organization_id: 1,
        user_id: 1,
        parent_organization_id: -1
      }]);
      done();
    });

    it('should create default fileManager data', (done) => {
      const userData = initDataGenerator.getInitDataFileManager();
      const creationDate = userData[0].creation_date; // can't be determined
      expect(userData).to.deep.equal([{
        organization_id: 1,
        folder_id: 0,
        file_id: 1,
        file_name: 'newFile.md',
        file_markdown: '',
        permission_index: 1,
        creation_date: creationDate,
        last_modified_date: creationDate,
        file_path: '/root/'
      }]);
      done();
    });

    it('should create default folder data', (done) => {
      const userData = initDataGenerator.getInitDataFolder();
      const creationDate = userData[0].creation_date; // can't be determined
      expect(userData).to.deep.equal([{
        folder_id: 0,
        parent_folder_id: -1,
        permission_index: 1,
        organization_id: 1,
        creation_date: creationDate,
        folder_name: 'root',
        last_modified_date: creationDate,
        folder_path: '/root/'
      }]);
      done();
    });
  });
});
