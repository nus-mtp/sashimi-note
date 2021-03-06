import registerPromiseWorker from 'promise-worker/register';
import markdownProcessor from './markdownProcessor';
import xssFilter from './xssFilter';

/**
  * Process a given markdown string and update the HTML string

  * @param {string} markdown - can be mixed with html and css
  */
  /*
export default function worker(self) {
  self.addEventListener('message', (event) => {
    const markdownString = event.data;
    let data = markdownProcessor.process(markdownString);
    data = xssFilter.filter(data);
    self.postMessage(data);
  });
}
*/

/* eslint arrow-body-style: 0 */
registerPromiseWorker((data) => {
  const markdownString = data;
  let processedData = markdownProcessor.process(markdownString);
  processedData = xssFilter.filter(processedData);
  return processedData;
  /*
  return Promise.resolve().then((rawData) => {
    const markdownString = rawData;
    let processedData = markdownProcessor.process(markdownString);
    processedData = xssFilter.filter(processedData);
    return processedData;
  });
  */
});

// to pacify webworkify-webpack
export default function worker() {}
