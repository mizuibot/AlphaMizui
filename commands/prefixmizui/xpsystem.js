const fs = require("fs");

const XP_FILE = "./xp.json";

function loadXP() {
  if (!fs.existsSync(XP_FILE)) {
    fs.writeFileSync(
      XP_FILE,
      JSON.stringify({}, null, 2)
    );
  }

  return JSON.parse(
    fs.readFileSync(
      XP_FILE,
      "utf8"
    )
  );
}

function saveXP(data) {
  fs.writeFileSync(
    XP_FILE,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function createUser(userId) {

  const data = loadXP();

  if (!data[userId]) {

    data[userId] = {

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

    saveXP(data);
  }

  return data;
}

function getMultiplier(level) {

  if (level >= 75) return 4;

  if (level >= 50) return 3;

  if (level >= 25) return 2;

  return 1;
}

function xpNeeded(level) {

  return Math.floor(
    100 * Math.pow(level, 1.5)
  );
}

function addXP(userId, amount) {

  const data =
    createUser(userId);

  const user =
    data[userId];

  user.multiplier =
    getMultiplier(
      user.level
    );

  const gainedXP =
    Math.floor(
      amount *
      user.multiplier
    );

  user.xp += gainedXP;

  user.messages++;

  let leveledUp = false;

  while (
    user.xp >=
    xpNeeded(user.level)
  ) {

    user.xp -=
      xpNeeded(user.level);

    user.level++;

    leveledUp = true;
  }

  saveXP(data);

  return {

    level:
      user.level,

    xp:
      user.xp,

    gainedXP,

    leveledUp
  };
}

function getUser(userId) {

  const data =
    createUser(userId);

  return data[userId];
}

module.exports = {

  loadXP,

  saveXP,

  createUser,

  addXP,

  getUser,

  xpNeeded,

  getMultiplier
};
