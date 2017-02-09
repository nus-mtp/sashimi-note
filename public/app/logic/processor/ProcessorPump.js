// Import contentManipulator module
let cm = require("../contentManipulator/contentManipulator.js");
//let mdp = require("/public/app/logic/mdp");

function sendToProcessors(data) {

}

cm.on('change', (data) => {
  sendToProcessors(data);
});
