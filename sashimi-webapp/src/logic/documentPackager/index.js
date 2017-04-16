import work from 'webworkify-webpack';
import PromiseWorker from 'promise-worker';

const w = work(require.resolve('./worker.js'));
const promiseWorker = new PromiseWorker(w);

export default {
  // init(listener) {
  //   w.addEventListener('message', listener);
  // },
  /*
  getHtmlData(markdownString) {
    w.postMessage(markdownString);
  }
  */

  /* eslint arrow-body-style: 0 */
  getHtmlData(markdownString) {
    return promiseWorker.postMessage(markdownString)
    .then((htmlString) => {
      return htmlString;
    });
  }

};
