/*
 *  The purpose of this function is to allow initDataGenerator.js to create array
 *  of array of object that suits alasql to create default data in nonsql indexeddb
 *
 */

import constants from '../constants';

let sqlObject = {};
let isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_CLOSED;

export default function sqlArray() {
  this.initializeAlasqlArray = function initializeAlasqlArray() {
    if (!isAlasqlArrayInitialized) {
      sqlObject = {};
      isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_INITIALIZED;
    }
  };
}
