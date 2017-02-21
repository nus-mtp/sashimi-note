import Vue from 'vue';
import Router from 'vue-router';
import FileManager from 'components/FileManager';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'fileManager',
      component: FileManager,
    },
  ],
});
