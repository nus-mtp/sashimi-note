/*
 *  The purpose of this function is to allow initDataGenerator.js to create array
 *  of array of object that suits alasql to create default data in nonsql indexeddb
 *
 */

import constants from 'src/database/constants';

let sqlObject = {};
const sqlArrayOfObjects = [];
let isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_CLOSED;

function endOfCreateAlasqlStringForAlasql() {
  return [sqlObject];
}

export default function sqlArray() {
  this.initializeAlasqlArray = function initializeAlasqlArray() {
    if (!isAlasqlArrayInitialized) {
      sqlObject = {};
      isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_INITIALIZED;
    }
  };

  this.initializeNextAlasqlArray = function initializeNextAlasqlArray() {
    if (isAlasqlArrayInitialized) {
      sqlArrayOfObjects.push(sqlObject);
      isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_CLOSED;
      this.initializeAlasqlArray();
    }
  };

  this.addKeyBasePair = function addKeyBasePair(key, value) {
    if (isAlasqlArrayInitialized) {
      sqlObject[key] = value;
    }
  };

  this.endAlasqlArray = function endAlasqlArray() {
    // case 1: only 1 object to return
    if (isAlasqlArrayInitialized && sqlArrayOfObjects.length === 0) {
      isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_CLOSED;
      const returnSqlArrayObject = endOfCreateAlasqlStringForAlasql();
      return returnSqlArrayObject;
    // case 2: return multiple objects
    } else if (isAlasqlArrayInitialized && sqlArrayOfObjects.length > 0) {
      isAlasqlArrayInitialized = constants.CONST_ALASQL_CREATION_CLOSED;
      return sqlArrayOfObjects;
    } else {
      // return empty alasql array of array of object
      return [{}];
    }
  };
}
