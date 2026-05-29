const fs = require("fs");

const FILE = "./guild-economy.json";

function loadDB() {

  if (!fs.existsSync(FILE)) {

    fs.writeFileSync(
      FILE,
      JSON.stringify({ guilds: {} }, null, 2)
    );
  }

  return JSON.parse(
    fs.readFileSync(FILE, "utf8")
  );
}

function saveDB(db) {

  fs.writeFileSync(
    FILE,
    JSON.stringify(db, null, 2)
  );
}

function ensureUser(
  db,
  guildId,
  userId,
  username = "Unknown",
  avatar = ""
) {

  if (!db.guilds[guildId]) {

    db.guilds[guildId] = {
      users: {}
    };
  }

  if (!db.guilds[guildId].users[userId]) {

    db.guilds[guildId].users[userId] = {
      coins: 0,
      work: 0,
      username,
      avatar
    };
  }

  return db.guilds[guildId].users[userId];
}

function getUser(
  guildId,
  userId,
  username,
  avatar
) {

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

function addCoins(
  guildId,
  userId,
  amount,
  username,
  avatar
) {

  const db = loadDB();

  const user = ensureUser(
    db,
    guildId,
    userId,
    username,
    avatar
  );

  user.coins += amount;

  saveDB(db);
}

function removeCoins(
  guildId,
  userId,
  amount
) {

  const db = loadDB();

  const user = ensureUser(
    db,
    guildId,
    userId
  );

  user.coins -= amount;

  if (user.coins < 0) {
    user.coins = 0;
  }

  saveDB(db);
}

module.exports = {
  getUser,
  addCoins,
  removeCoins
};