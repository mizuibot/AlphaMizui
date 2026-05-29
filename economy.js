const fs = require("fs");
const FILE = "./economy.json";

function loadDB() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveDB(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function getUser(id, username = "Unknown", avatar = "") {
  const db = loadDB();

  if (!db.users[id]) {
    db.users[id] = {
      coins: 0,
      work: 0,
      username,
      avatar
    };
  }

  saveDB(db);
  return db.users[id];
}

function addCoins(id, amount) {
  const db = loadDB();
  if (!db.users[id]) return;
  db.users[id].coins += amount;
  saveDB(db);
}

module.exports = {
  getUser,
  addCoins
};