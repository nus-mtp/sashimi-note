// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import storage from 'src/database/storage';
import fileManager from 'src/logic/filemanager';
import Vue from 'vue';
import App from './App';
import router from './router';

// Initialise the application
storage
.initializeDatabase()
.then(fileManager.start)
.then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
  });
});
