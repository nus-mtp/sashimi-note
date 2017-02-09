// Import DocumentFormatter module
let df = require("../formatter/documentFormatter");

function deliver(data) {
  return df.format(data);
}
