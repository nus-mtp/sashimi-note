import markdownProcessor from './markdownProcessor';
import documentFormatter from './documentFormatter';
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
  * Get the base64 string of a PDF output given a markdown string
  * @param {string} markdown - can be mixed with html and css
  * @return {Promise<string, error>} Promise - containing the resultant base64 PDF output
  */
  getPagesData(markdownString) {
    return processMarkdown(markdownString)
    .then(htmlDataString =>
      documentFormatter.getPdfBase64(htmlDataString)
    );
  },

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

  /**
  * Get the HTML string of the given a markdown string
  * @param {string} markdown - can be mixed with html and css
  * @return {Promise<string, error>} Promise - containing resultant HTML string
  * @todo Implement this function.
  */
  getSlidesData(markdownString) {
    return processMarkdown(markdownString)
    .then(htmlDataString =>
      xssFilter.filter(htmlDataString)
    );
  },
};
