import markdownProcessor from './markdownProcessor';
import documentFormatter from './documentFormatter';

const processData = function processData(data) {
  return markdownProcessor.process(data);
};

const formatData = function formatData(data) {
  return documentFormatter.format(data);
};

export default {
  render: function render(data) {
    return formatData(processData(data));
  }
};
