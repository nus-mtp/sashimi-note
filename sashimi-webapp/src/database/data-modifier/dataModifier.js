/*
 * CS3283/4 dataModifier.js
 * This acts as a facade class for modifying and update data for storage facade
 *
 */

import dataAdd from './dataAdd';
import dataDelete from './dataDelete';

export default class dataModifier {
  static constructor() {}

  static deleteAllEntities() {
    dataDelete.deleteAllEntities();
  }
}
