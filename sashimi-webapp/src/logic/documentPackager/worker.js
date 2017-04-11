import markdownProcessor from './markdownProcessor';
import xssFilter from './xssFilter';

/**
  * Process a given markdown string and update the HTML string

  * @param {string} markdown - can be mixed with html and css
  */
export default function worker(self) {
  self.addEventListener('message', (event) => {
    const markdownString = event.data;
    let data = markdownProcessor.process(markdownString);
    data = xssFilter.filter(data);
    self.postMessage(data);
  });
}
