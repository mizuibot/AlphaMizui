const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../stats.json");

function loadStats() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveStats(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  loadStats,
  saveStats,
};