const fs = require("fs");
const path = require("path");

let cache = null;

const FILE = path.resolve(__dirname, "economy.json");
const MARRIAGES_FILE = path.resolve(__dirname, "marriages.json");

// =========================
// LOAD DB (SEGURO)
// =========================
function _loadFromFile() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({}, null, 2));
  }

  const raw = fs.readFileSync(FILE, "utf8");
  if (!raw || !raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.log("❌ Erro JSON economy:", err);
    return {};
  }
}

function loadDB() {
  cache = _loadFromFile();
  return cache;
}

// =========================
// SAVE DB
// =========================
function saveDB(db) {
  try {
    if (!db || typeof db !== "object") return;

    cache = db;

    fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.log("❌ Erro ao salvar DB:", err);
  }
}

// =========================
// MARIAGE DB
// =========================
function loadMarriages() {
  try {
    if (!fs.existsSync(MARRIAGES_FILE)) {
      fs.writeFileSync(MARRIAGES_FILE, JSON.stringify({}, null, 2));
    }

    const raw = fs.readFileSync(MARRIAGES_FILE, "utf8");
    if (!raw || !raw.trim()) return {};

    return JSON.parse(raw);
  } catch (err) {
    console.log("❌ Erro marriages:", err);
    return {};
  }
}

function saveMarriages(data) {
  fs.writeFileSync(MARRIAGES_FILE, JSON.stringify(data, null, 2));
}

// =========================
// ENSURE USER
// =========================
function ensureUser(db, id, username = "Unknown", avatar = "") {
  if (!db[id]) {
    db[id] = {
      coins: "0",
      bank: "0",
      work: 0,
      daily: 0,
      username,
      avatar,
      inventory: [],
      cooldowns: {},

      background: null,
      bio: "",
      customAvatar: null
    };

    saveDB(db);
  }

  const user = db[id];

  if (user.coins == null) user.coins = "0";
  if (user.bank == null) user.bank = "0";

  if (!Array.isArray(user.inventory)) user.inventory = [];
  if (!user.cooldowns) user.cooldowns = {};

  if (typeof user.work !== "number") user.work = 0;
  if (typeof user.daily !== "number") user.daily = 0;

  if (user.background == null) user.background = null;
  if (user.bio == null) user.bio = "";
  if (user.customAvatar == null) user.customAvatar = null;

  return user;
}


function getUser(id, username = "Unknown", avatar = "") {
  const db = loadDB();
  return ensureUser(db, id, username, avatar);
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

  user.coins = (toBig(user.coins) + BigInt(amount)).toString();
  saveDB(db);

  return user.coins;
}

function removeCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const value = BigInt(amount);

  if (value <= 0n || toBig(user.coins) < value) return false;

  user.coins = (toBig(user.coins) - value).toString();
  saveDB(db);

  return true;
}

// =========================
// BANCO
// =========================
function depositCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const value = BigInt(amount);

  if (value <= 0n || toBig(user.coins) < value) return false;

  user.coins = (toBig(user.coins) - value).toString();
  user.bank = (toBig(user.bank) + value).toString();

  saveDB(db);
  return true;
}

function withdrawCoins(id, amount) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const value = BigInt(amount);

  if (value <= 0n || toBig(user.bank) < value) return false;

  user.bank = (toBig(user.bank) - value).toString();
  user.coins = (toBig(user.coins) + value).toString();

  saveDB(db);
  return true;
}

// =========================
// TRANSFER
// =========================
function transferCoins(senderId, targetId, amount) {
  const db = loadDB();

  const sender = ensureUser(db, senderId);
  const target = ensureUser(db, targetId);

  const value = BigInt(amount);

  if (value <= 0n || toBig(sender.coins) < value) return false;

  sender.coins = (toBig(sender.coins) - value).toString();
  target.coins = (toBig(target.coins) + value).toString();

  saveDB(db);
  return true;
}

// =========================
// INVENTORY
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

  if (!user.cooldowns[key]) user.cooldowns[key] = 0;

  const diff = now - user.cooldowns[key];

  if (diff < cooldown) {
    return { ok: false, remaining: cooldown - diff };
  }

  user.cooldowns[key] = now;
  saveDB(db);

  return { ok: true, remaining: 0 };
}

// =========================
// CASAMENTO
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

// =========================
// BALANCE
// =========================
function getBalance(id) {
  const db = loadDB();
  const user = ensureUser(db, id);

  const marriages = loadMarriages();
  const marriage = marriages[id];

  if (!marriage || !marriage.partner) {
    return toBig(user.coins).toString();
  }

  const partner = ensureUser(db, marriage.partner);

  return (toBig(user.coins) + toBig(partner.coins)).toString();
}

// =========================
// EXPORTS
// =========================
module.exports = {
  loadDB,
  saveDB,
  getUser,
  ensureUser,

  addCoins,
  removeCoins,

  depositCoins,
  withdrawCoins,
  transferCoins,

  addItem,
  hasItem,

  canUse,
  toBig,

  marry,
  divorce,
  getBalance
};
