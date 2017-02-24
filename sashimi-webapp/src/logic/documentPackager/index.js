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
  render: function render(data) {
    const formattedData = formatData(processData(data));
    return xssFilter.filter(formattedData);
  }
};
