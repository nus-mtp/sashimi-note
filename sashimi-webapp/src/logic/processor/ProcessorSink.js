// Import DocumentFormatter module
const df = require("../formatter/documentFormatter");

const processorSink = {
  deliver: function deliver(data) {
    return df.format(data);
  },
};

module.exports = processorSink;
