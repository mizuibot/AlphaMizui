const fs = require("fs");
const { file } = require("../../storage");

const XP_FILE = file("xp.json");

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

function getMultiplier(user) {
  let multi = 1;

  // Bônus por comandos usados
  if (user.commandsUsed >= 100) multi += 0.5;
  if (user.commandsUsed >= 500) multi += 0.5;
  if (user.commandsUsed >= 1000) multi += 1;

  // Bônus por streak
  if (user.streak >= 7) multi += 0.5;
  if (user.streak >= 30) multi += 1;

  return multi;
}

function xpNeeded(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function updateClass(user) {
  if (user.level >= 100) {
    user.class = "Classe X";
  } else if (user.level >= 90) {
    user.class = "Classe IX";
  } else if (user.level >= 85) {
    user.class = "Classe VIII";
  } else if (user.level >= 80) {
    user.class = "Classe VII";
  } else if (user.level >= 70) {
    user.class = "Classe VI";
  } else if (user.level >= 55) {
    user.class = "Classe V";
  } else if (user.level >= 40) {
    user.class = "Classe IV";
  } else if (user.level >= 25) {
    user.class = "Classe III";
  } else if (user.level >= 15) {
    user.class = "Classe II";
  } else if (user.level >= 10) {
    user.class = "Classe I";
  } else {
    user.class = "Sem Classe";
  }
}

function addXP(userId, amount) {
  createUser(userId);

  const user = cache[userId];

  user.multiplier = getMultiplier(user);

  const gainedXP = Math.floor(amount * user.multiplier);

  user.xp += gainedXP;
  user.messages++;

  let leveledUp = false;

  while (user.xp >= xpNeeded(user.level)) {
  user.xp -= xpNeeded(user.level);
  user.level++;
  leveledUp = true;

  if (user.level >= 100) {
    user.prestige++;
    user.level = 1;
    user.xp = 0;
  }
}

  updateClass(user);

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
