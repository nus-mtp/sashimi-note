// Importing modules
const cm = require("../contentManipulator/contentManipulator");
const cp = require("./conditionalProcessor");
const mdp = require("./markdownProcessor");
const pp = require("./pluginProcessor");
const ps = require("./processorSink");

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
  console.log(data);
});
