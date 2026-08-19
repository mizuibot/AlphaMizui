const fs = require("fs");
const path = require("path");

const { file } = require("../storage");

const FILE = file("stats.json");

function loadStats() {
  try {
    if (!fs.existsSync(FILE)) return {};

    const raw = fs.readFileSync(FILE, "utf8");

    if (!raw || !raw.trim()) return {};

    return JSON.parse(raw);
  } catch (err) {
    console.log("❌ Erro ao carregar stats.json:", err);
    return {};
  }
}

function saveStats(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("❌ Erro ao salvar stats.json:", err);
  }
}

module.exports = {
  loadStats,
  saveStats,
};
