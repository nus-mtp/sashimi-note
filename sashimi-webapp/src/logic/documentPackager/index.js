import work from 'webworkify-webpack';

const w = work(require.resolve('./worker.js'));

export default {
  init(listener) {
    w.addEventListener('message', listener);
  },

  getHtmlData(markdownString) {
    w.postMessage(markdownString);
  }
};
