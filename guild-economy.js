const fs = require("fs");
const path = require("path");

const FILE = path.resolve(__dirname, "guild-economy.json");

// =========================
// LOAD DB (SEGURADO)
// =========================
function loadDB() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(
        FILE,
        JSON.stringify({ guilds: {} }, null, 2)
      );
      return { guilds: {} };
    }

    const raw = fs.readFileSync(FILE, "utf8");

    if (!raw || !raw.trim()) {
      return { guilds: {} };
    }

    const db = JSON.parse(raw);

    if (!db.guilds) db.guilds = {};

    return db;
  } catch (err) {
    console.log("❌ Erro ao carregar guild DB:", err);
    return { guilds: {} };
  }
}

// =========================
// SAVE DB (SEGURADO)
// =========================
function saveDB(db) {
  try {
    if (!db || typeof db !== "object") return;

    fs.writeFileSync(
      FILE,
      JSON.stringify(db, null, 2)
    );
  } catch (err) {
    console.log("❌ Erro ao salvar guild DB:", err);
  }
}

// =========================
// ENSURE USER
// =========================
function ensureUser(
  db,
  guildId,
  userId,
  username = "Unknown",
  avatar = ""
) {
  if (!db.guilds[guildId]) {
    db.guilds[guildId] = { users: {} };
  }

  if (!db.guilds[guildId].users[userId]) {
    db.guilds[guildId].users[userId] = {
      coins: 0,
      work: 0,
      username,
      avatar
    };
  }

  const user = db.guilds[guildId].users[userId];

  if (typeof user.coins !== "number") user.coins = 0;
  if (typeof user.work !== "number") user.work = 0;

  return user;
}

// =========================
// GET USER
// =========================
function getUser(guildId, userId, username, avatar) {
  const db = loadDB();

  const user = ensureUser(
    db,
    guildId,
    userId,
    username,
    avatar
  );

  saveDB(db);

  return user;
}

// =========================
// ADD COINS
// =========================
function addCoins(guildId, userId, amount, username, avatar) {
  const db = loadDB();

  const user = ensureUser(
    db,
    guildId,
    userId,
    username,
    avatar
  );

  user.coins += Number(amount || 0);

  saveDB(db);
}

// =========================
// REMOVE COINS
// =========================
function removeCoins(guildId, userId, amount) {
  const db = loadDB();

  const user = ensureUser(db, guildId, userId);

  const value = Number(amount || 0);

  user.coins -= value;

  if (user.coins < 0) user.coins = 0;

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