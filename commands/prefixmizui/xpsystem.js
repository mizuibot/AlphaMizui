const fs = require("fs");

const XP_FILE = "./xp.json";

// 🔥 CACHE EM MEMÓRIA (NÃO LÊ TODA HORA)
let cache = {};
let dirty = false;

// carrega UMA vez
function loadXP() {
  if (fs.existsSync(XP_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(XP_FILE, "utf8"));
    } catch {
      cache = {};
    }
  } else {
    cache = {};
    fs.writeFileSync(XP_FILE, JSON.stringify({}, null, 2));
  }

  return cache;
}

// salva tudo
function saveXP() {
  fs.writeFileSync(XP_FILE, JSON.stringify(cache, null, 2));
  dirty = false;
}

// cria usuário em memória
function createUser(userId) {
  if (!cache[userId]) {
    cache[userId] = {
      xp: 0,
      level: 1,
      prestige: 0,
      streak: 0,
      messages: 0,
      voiceMinutes: 0,
      commandsUsed: 0,
      class: "none",
      multiplier: 1,
      lastMessage: 0,
      lastDaily: 0
    };

    dirty = true;
  }

  return cache;
}

function getMultiplier(level) {
  if (level >= 75) return 4;
  if (level >= 50) return 3;
  if (level >= 25) return 2;
  return 1;
}

function xpNeeded(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function addXP(userId, amount) {
  createUser(userId);

  const user = cache[userId];

  user.multiplier = getMultiplier(user.level);

  const gainedXP = Math.floor(amount * user.multiplier);

  user.xp += gainedXP;
  user.messages++;

  let leveledUp = false;

  while (user.xp >= xpNeeded(user.level)) {
    user.xp -= xpNeeded(user.level);
    user.level++;
    leveledUp = true;
  }

  dirty = true;

  return {
    level: user.level,
    xp: user.xp,
    gainedXP,
    leveledUp
  };
}

function getUser(userId) {
  createUser(userId);
  return cache[userId];
}

// 🔥 AUTO-SAVE (ESSENCIAL)
setInterval(() => {
  if (!dirty) return;
  saveXP();
  console.log("💾 XP salvo no disco");
}, 30000);

// inicializa ao importar
loadXP();

module.exports = {
  loadXP,
  saveXP,
  createUser,
  addXP,
  getUser,
  xpNeeded,
  getMultiplier
};
