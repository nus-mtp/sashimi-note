import constants from '../constants';

import SqlCommands from '../sql-related/SqlCommands';

const sqlCommands = new SqlCommands();

export default class dataDelete {
  static constructor() {}

  static deleteAllEntities() {
    for (let index = 0; index < constants.arrayEntitiesName.length; index += 1) {
      sqlCommands.deleteTable(constants.arrayEntitiesName[index]);
    }
  }
}
