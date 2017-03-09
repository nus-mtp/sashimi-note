import markdownProcessor from './markdownProcessor';
import xssFilter from './xssFilter';

/**
  * Convert markdown string into HTML string
  * @param {string} markdown - can be mixed with html and css
  * @return {Promise<string, error>} Promise - containing the HTML string
  */
const processMarkdown = (markdownString =>
  new Promise((resolve, reject) => {
    try {
      resolve(markdownProcessor.process(markdownString));
    } catch (error) {
      reject(error);
    }
  })
);

export default {
  /**
  * Get the HTML string of the given a markdown string
  * @param {string} markdown - can be mixed with html and css
  * @return {Promise<string, error>} Promise - containing resultant HTML string
  */
  getHtmlData(markdownString) {
    return processMarkdown(markdownString)
    .then(htmlDataString =>
      xssFilter.filter(htmlDataString)
    );
  },
};
