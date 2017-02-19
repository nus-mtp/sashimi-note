const markdownProcessor = require('./markdownProcessor');
const documentFormatter = require('./documentFormatter');

const processData = function processData(data) {
  return markdownProcessor.process(data);
};

const formatData = function formatData(data) {
  return documentFormatter.format(data);
};

const wrapper = {
  render: function render(data) {
    return formatData(processData(data));
  }
};

module.exports = wrapper;

