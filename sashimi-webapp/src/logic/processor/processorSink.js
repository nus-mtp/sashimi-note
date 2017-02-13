// Import DocumentFormatter module
const df = require('../formatter/documentFormatter');

const processorSink = {
  deliver: function deliver(data) {
    return df.set(data);
  },
};

module.exports = processorSink;
