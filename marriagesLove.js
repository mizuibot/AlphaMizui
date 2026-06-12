const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "marriageLove.json"
);

function loadLove() {

  if (!fs.existsSync(FILE)) {

    fs.writeFileSync(
      FILE,
      JSON.stringify({}, null, 2)
    );
  }

  try {

    return JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );

  } catch {

    return {};
  }
}

function saveLove(data) {

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );
}

function getPairId(userA, userB) {

  return [userA, userB]
    .sort()
    .join("_");
}

function createPair() {

  return {
    love: 100,

    marriedSince: Date.now(),

    handshake: 0,
    patpat: 0,
    hug: 0,
    kiss: 0,

    lastInteraction: Date.now()
  };
}

function getLove(userA, userB) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {

    data[pair] = createPair();

    saveLove(data);
  }

  const loveData = data[pair];

  const now = Date.now();

  const ONE_DAY = 86400000;

  const daysWithoutInteraction =
    Math.floor(
      (now - loveData.lastInteraction)
      / ONE_DAY
    );

  if (daysWithoutInteraction > 0) {

    loveData.love -= daysWithoutInteraction * 25;

    if (loveData.love < 0) {
      loveData.love = 0;
    }

    loveData.lastInteraction +=
      daysWithoutInteraction * ONE_DAY;

    saveLove(data);
  }

  return loveData;
}

function setLove(userA, userB, amount) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].love = amount;

  if (data[pair].love > 100)
    data[pair].love = 100;

  if (data[pair].love < 0)
    data[pair].love = 0;

  data[pair].lastInteraction =
    Date.now();

  saveLove(data);

  return data[pair].love;
}

function addLove(userA, userB, amount) {

  const data = loadLove();
  const pair = getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  const current = data[pair].love;

  // 🚫 já está no máximo
  if (current >= 100) {
    data[pair].love = 100;
    saveLove(data);
    return 100;
  }

  // ➕ soma sem ultrapassar 100
  const newValue = Math.min(100, current + amount);

  data[pair].love = newValue;
  data[pair].lastInteraction = Date.now();

  saveLove(data);

  return newValue;
}

function removeLove(userA, userB, amount) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].love -= amount;

  if (data[pair].love < 0) {
    data[pair].love = 0;
  }

  data[pair].lastInteraction =
    Date.now();

  saveLove(data);

  return data[pair].love;
}

// =====================
// CONTADORES
// =====================

function addHandshake(userA, userB) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].handshake++;

  data[pair].lastInteraction = Date.now();

  saveLove(data);

  return data[pair].handshake;
}

function addPatPat(userA, userB) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].patpat++;

  data[pair].lastInteraction = Date.now();

  saveLove(data);

  return data[pair].patpat;
}

function addHug(userA, userB) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].hug++;

  data[pair].lastInteraction = Date.now();

  saveLove(data);

  return data[pair].hug;
}

function addKiss(userA, userB) {

  const data = loadLove();

  const pair =
    getPairId(userA, userB);

  if (!data[pair]) {
    data[pair] = createPair();
  }

  data[pair].kiss++;

  data[pair].lastInteraction = Date.now();

  saveLove(data);

  return data[pair].kiss;
}

module.exports = {

  loadLove,
  saveLove,

  getLove,

  setLove,
  addLove,
  removeLove,

  addHandshake,
  addPatPat,
  addHug,
  addKiss
};