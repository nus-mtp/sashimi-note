import Vue from 'vue';
import Router from 'vue-router';
import FileManager from 'components/file-manager/FileManager';
import Content from 'components/editor-viewer/Content';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'fileManager',
      component: FileManager,
    },
    {
      path: '/content',
      name: 'Content',
      component: Content,
    },
  ],
});
