const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

module.exports = {
  DATA_DIR,
  file(name) {
    return path.join(DATA_DIR, name);
  }
};
