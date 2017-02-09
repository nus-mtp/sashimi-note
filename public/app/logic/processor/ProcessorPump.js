// Importing modules
let cm = require("../contentManipulator/contentManipulator.js");
let cp = require("./conditionalProcessor");
let mdp = require("./markdownProcessor");
let pp = require("./pluginProcessor");
let ps = require("./processorSink");

function sendToConditional(data) {
  cp.process(data);
}

function sendToMarkdown(data) {
  mdp.process(data);
}

function sendToPlugin(data) {
  pp.process(data);
}

function sendToProcessors(data) {
  let processed = data;

  // Send data to Conditional Processor
  processed = sendToConditional(processed);

  // Send processed data To Markdown Processor
  processed = sendToMarkdown(processed);

  // Send processed data To Plugin Processor
  processed = sendToPlugin(processed);

  // Send to ProcessorSink for delivery to DocumentFormatter Component
  ps.deliver(processed);

  return processed;
}

cm.on('change', (data) => {
  sendToProcessors(data);
});
