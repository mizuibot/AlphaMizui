const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "economy.json");
const MARRIAGES_FILE = path.join(__dirname, "marriages.json");

// =========================
// DB PRINCIPAL
// =========================

function _loadFromFile() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ users: {} }, null, 2));
  }

  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function loadDB() {
  if (!global.dbCache) {
    global.dbCache = _loadFromFile();
  }
  return global.dbCache;
}

function saveDB(db) {
  global.dbCache = db;
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

// =========================
// CASAMENTO DB
// =========================

function loadMarriages() {
  try {
    if (!fs.existsSync(MARRIAGES_FILE)) {
      fs.writeFileSync(
        MARRIAGES_FILE,
        JSON.stringify({}, null, 2)
      );
    }

    return JSON.parse(
      fs.readFileSync(MARRIAGES_FILE, "utf8")
    );
  } catch (err) {
    console.log("Erro marriages:", err);
    return {};
  }
}

function saveMarriages(data) {
  fs.writeFileSync(
    MARRIAGES_FILE,
    JSON.stringify(data, null, 2)
  );
}

// =========================
// USER
// =========================

function ensureUser(db, id, username = "Unknown", avatar = "") {
  if (!db.users) db.users = {};

  if (!db.users[id]) {
    db.users[id] = {
      coins: "0",
      bank: "0",
      work: 0,
      daily: 0,
      username,
      avatar,
      inventory: [],
      cooldowns: {}
    };
  }

  const user = db.users[id];

  if (user.coins == null) user.coins = "0";
  if (user.bank == null) user.bank = "0";

  if (!Array.isArray(user.inventory)) user.inventory = [];
  if (!user.cooldowns) user.cooldowns = {};

  if (typeof user.work !== "number") user.work = 0;
  if (typeof user.daily !== "number") user.daily = 0;

  return user;
}

function getUser(id, username = "Unknown", avatar = "") {
  const db = loadDB();

  const user = ensureUser(db, id, username, avatar);

  user.username = username;
  user.avatar = avatar;

  saveDB(db);
  return user;
}

// =========================
// BIGINT HELP
// =========================

function toBig(n) {
  try {
    return BigInt(n || "0");
  } catch {
    return 0n;
  }
}

// =========================
// COINS
// =========================

function addCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const coins = toBig(user.coins);
  user.coins = (coins + BigInt(amount)).toString();

  saveDB(db);
  return user.coins;
}

function removeCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const coins = toBig(user.coins);
  const value = BigInt(amount);

  if (value <= 0n || coins < value) return false;

  user.coins = (coins - value).toString();

  saveDB(db);
  return true;
}

// =========================
// BANCO
// =========================

function depositCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const coins = toBig(user.coins);
  const bank = toBig(user.bank);
  const value = BigInt(amount);

  if (value <= 0n || coins < value) return false;

  user.coins = (coins - value).toString();
  user.bank = (bank + value).toString();

  saveDB(db);
  return true;
}

function withdrawCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const coins = toBig(user.coins);
  const bank = toBig(user.bank);
  const value = BigInt(amount);

  if (value <= 0n || bank < value) return false;

  user.bank = (bank - value).toString();
  user.coins = (coins + value).toString();

  saveDB(db);
  return true;
}

// =========================
// TRANSFERÊNCIA
// =========================

function transferCoins(senderId, targetId, amount) {
  const db = loadDB();

  const sender = ensureUser(db, senderId);
  const target = ensureUser(db, targetId);

  const senderCoins = toBig(sender.coins);
  const targetCoins = toBig(target.coins);
  const value = BigInt(amount);

  if (value <= 0n || senderCoins < value) return false;

  sender.coins = (senderCoins - value).toString();
  target.coins = (targetCoins + value).toString();

  saveDB(db);
  return true;
}

// =========================
// INVENTÁRIO
// =========================

function addItem(id, item) {
  const db = loadDB();
  const user = ensureUser(db, id);

  user.inventory.push(item);

  saveDB(db);
  return true;
}

function hasItem(id, item) {
  const db = loadDB();
  const user = ensureUser(db, id);

  return user.inventory.includes(item);
}

// =========================
// COOLDOWN
// =========================

function canUse(id, key, cooldown) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const now = Date.now();

  if (!user.cooldowns[key]) {
    user.cooldowns[key] = 0;
  }

  const diff = now - user.cooldowns[key];

  if (diff < cooldown) {
    return {
      ok: false,
      remaining: cooldown - diff
    };
  }

  user.cooldowns[key] = now;

  saveDB(db);

  return { ok: true, remaining: 0 };
}

// =========================
// CASAMENTO (🔥 NOVO SISTEMA)
// =========================

function marry(userA, userB) {
  const marriages = loadMarriages();

  marriages[userA] = { partner: userB };
  marriages[userB] = { partner: userA };

  saveMarriages(marriages);
}

function divorce(userId) {
  const marriages = loadMarriages();

  const partner = marriages[userId]?.partner;

  if (!partner) return false;

  delete marriages[userId];
  delete marriages[partner];

  saveMarriages(marriages);

  return true;
}

// 💰 SALDO COM CASAMENTO
function getBalance(id) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const marriages = loadMarriages();
  const marriage = marriages[id];

  if (!marriage || !marriage.partner) {
    return toBig(user.coins).toString();
  }

  const partner = ensureUser(db, marriage.partner);

  const total =
    toBig(user.coins) + toBig(partner.coins);

  return total.toString();
}

// =========================
// TEMPO
// =========================

function formatTime(ms) {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hour = Math.floor(ms / 3600000);

  if (hour > 0) return `${hour}h ${min}m ${sec}s`;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}

// =========================
// EXPORTS
// =========================

module.exports = {
  loadDB,
  saveDB,
  getUser,

  addCoins,
  removeCoins,

  depositCoins,
  withdrawCoins,

  transferCoins,

  addItem,
  hasItem,

  canUse,
  formatTime,

  // 💍 CASAMENTO
  marry,
  divorce,
  getBalance
};