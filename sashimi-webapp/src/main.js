// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import et from './database/create/entitiesCreator';
import storage from './database/storage';
import q from './database/retrieve/query';
import Sql from './database/sql-related/sqlCommands';
import datag from './database/create/initDataGenerator';

const sql = new Sql();
const alasql = require('alasql');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});

storage.initializeDatabase()
    .then((data2) => {
      console.log('initializeDatabase');
      console.log(data2);
      return true;
    })
    .catch(sqlErr => console.log(sqlErr))
  .then(data => sql.getFullTableData('user')
    .then((data2) => {
      console.log('user');
      console.log(data2);
    }))
    .catch(sqlErr => console.log(sqlErr))
  .then(data => sql.getFullTableData('folder')
    .then((data2) => {
      console.log('folder');
      console.log(data2);
    }))
    .catch(sqlErr => console.log(sqlErr))
  .then(data => sql.getFullTableData('file_manager')
    .then((data2) => {
      console.log('file_manager');
      console.log(data2);
    }))
    .catch(sqlErr => console.log(sqlErr))
  .then(data => sql.getFullTableData('organization')
    .then((data2) => {
      console.log('organization');
      console.log(data2);
    }))
    .catch(sqlErr => console.log(sqlErr))
  .catch(sqlErr => console.log(sqlErr));

/*
storage.deleteAll()
  .then(data => storage.initializeDatabase()
    .then((data2) => {
      console.log('initializeDatabase');
      console.log(data2);
    })
      ).catch(sqlError => console.log(sqlError))
  .then(data =>
    // get max file id here
     sql.getFullTableData('user')
      .then((data3) => {
        console.log('get table user');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .then(data =>
    // get max file id here
     sql.getFullTableData('organization')
      .then((data3) => {
        console.log('get table organization');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .then(data =>
    // get max file id here
     sql.getFullTableData('file_manager')
      .then((data3) => {
        console.log('get file manager');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .then(data =>
    // get max file id here
     sql.getFullTableData('folder')
      .then((data3) => {
        console.log('get table folder');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .then(data =>
      storage.createFile(0, '0', 0)
        .then((data2) => {
          console.log('createFile2');
          console.log(data2);
        }).catch(sqlError => console.log(sqlError)))
  .then(data =>
      storage.createFile(0, '0', 0)
        .then((data2) => {
          console.log('createFile2');
          console.log(data2);
        }).catch(sqlError => console.log(sqlError)))
  .then(data =>
    // get max file id here
     sql.getMaxFileId()
      .then((data3) => {
        console.log('getMaxFileId');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .then(data =>
    // get max file id here
     sql.getFullTableData('user')
      .then((data3) => {
        console.log('get table user');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)))
  .catch(sqlError => console.log(sqlError));
*/
/*

storage.initializeDatabase()
  .then((data) => {
    console.log('initializeDatabase');
    console.log(data);
  }
  ).then(data =>
    sql.getFullTableData('folder')
      .then((data3) => {
        console.log('getfile');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError)));


storage.initializeDatabase()
  .then((data) => {
    console.log('initializeDatabase');
    console.log(data);
  })
  .then(data =>
    sql.getFullTableData('file_manager')
      .then((data3) => {
        console.log('getfile');
        console.log(data3);
      }).catch(sqlError => console.log(sqlError))
  )
  .catch(sqlError => console.log(sqlError));
*/
