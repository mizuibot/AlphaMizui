const path = require("path");

const DATA_DIR = process.env.DATA_DIR || __dirname;

module.exports = {
  DATA_DIR,
  file(name) {
    return path.join(DATA_DIR, name);
  }
};
