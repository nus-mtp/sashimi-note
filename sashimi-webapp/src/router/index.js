import Vue from 'vue';
import Router from 'vue-router';
import FileManager from 'components/FileManager';
import Content from 'components/editor-viewer/Content';

Vue.use(Router);

export default new Router({
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
