import markdownProcessor from './markdownProcessor';
import documentFormatter from './documentFormatter';
import xssFilter from './xssFilter';


const processData = function processData(data) {
  return markdownProcessor.process(data);
};

const formatData = function formatData(data) {
  return documentFormatter.format(data);
};

export default {
  // Return something amazing
  getPagesData(htmlDataString) {
    return documentFormatter.getPdfBlob(htmlDataString);
  },

  getDataWithViewMode(markdownString, viewMode) {
    viewMode = viewMode || 'html';

    const htmlDataString = markdownProcessor.process(markdownString);

    switch (viewMode) {
      case 'pages': return this.getPagesData(htmlDataString);
      case 'html': return htmlDataString;
      default: return htmlDataString;
    }
  },
  render: function render(data) {
    const formattedData = formatData(processData(data));
    return xssFilter.filter(formattedData);
  }
};
