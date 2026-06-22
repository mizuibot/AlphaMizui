const fs = require("fs");

const xpFile = "./xp.json";

function loadXP() {
  return JSON.parse(
    fs.readFileSync(
      xpFile,
      "utf8"
    )
  );
}

function saveXP(data) {
  fs.writeFileSync(
    xpFile,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function createUser(
  userId
) {

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

      lastMessage: 0,

      lastDaily: 0
    };

    saveXP(data);
  }

  return data;
}

module.exports = {

  loadXP,

  saveXP,

  createUser
};
