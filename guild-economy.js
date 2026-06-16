const fs = require("fs");
const path = require("path");

const FILE = path.resolve(__dirname, "guild-economy.json");

// =========================
// LOAD DB
// =========================
function loadDB() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify({ guilds: {} }, null, 2));
      return { guilds: {} };
    }

    const raw = fs.readFileSync(FILE, "utf8");

    if (!raw || !raw.trim()) return { guilds: {} };

    const db = JSON.parse(raw);

    if (!db.guilds) db.guilds = {};

    return db;
  } catch (err) {
    console.log("❌ Erro guild DB:", err);
    return { guilds: {} };
  }
}

// =========================
// SAVE DB
// =========================
function saveDB(db) {
  try {
    if (!db || typeof db !== "object") return;

    fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.log("❌ Erro salvar guild DB:", err);
  }
}

// =========================
// ENSURE USER
// =========================
function ensureUser(db, guildId, userId, username = "Unknown", avatar = "") {
  if (!db.guilds[guildId]) {
    db.guilds[guildId] = { users: {} };
  }

  if (!db.guilds[guildId].users[userId]) {
    db.guilds[guildId].users[userId] = {
      coins: "0",
      work: 0,
      username,
      avatar
    };
  }

  const user = db.guilds[guildId].users[userId];

  if (user.coins == null) user.coins = "0";
  if (typeof user.work !== "number") user.work = 0;

  return user;
}

// =========================
// GET USER
// =========================
function getUser(guildId, userId, username, avatar) {
  const db = loadDB();

  const user = ensureUser(db, guildId, userId, username, avatar);

  saveDB(db);

  return user;
}

// =========================
// ADD COINS
// =========================
function addCoins(guildId, userId, amount, username, avatar) {
  const db = loadDB();

  const user = ensureUser(db, guildId, userId, username, avatar);

  console.log("GUILD:", guildId);
console.log("USER:", userId);
console.log("COINS ATUAL:", db.guilds?.[guildId]?.users?.[userId]);

  user.coins = (BigInt(user.coins) + BigInt(amount || "0")).toString();

  saveDB(db);
}

// =========================
// REMOVE COINS
// =========================
function removeCoins(guildId, userId, amount) {
  const db = loadDB();

  const user = ensureUser(db, guildId, userId);

  const value = BigInt(amount || "0");
  const coins = BigInt(user.coins || "0");

  let result = coins - value;

  if (result < 0n) result = 0n;

  user.coins = result.toString();

  saveDB(db);
}

// =========================
// EXPORTS
// =========================
module.exports = {
  getUser,
  addCoins,
  removeCoins
};
