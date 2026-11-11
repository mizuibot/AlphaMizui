
const fs = require("fs");
const path = require("path");

const INVENTORY_FILE = path.join(__dirname, "inventory.json");

const products = [
  
  {
    id: "arrascaeta",
    name: "Autógrafo do Arrascaeta",
    price: 125000,
    image: "https://i.pinimg.com/originals/b7/92/51/b79251b204c7b2a4fe408879d071837d.jpg"
  },
  {
    id: "bruno_henrique",
    name: "Autógrafo do Bruno Henrique",
    price: 125000,
    image: "https://media.gettyimages.com/id/2294604126/pt/foto/quito-ecuador-bruno-henrique-of-flamengo-celebrates-scoring-his-teams-first-goal-during-the.jpg?s=612x612&w=0&k=20&c=r9aw43kLCDtnhsL-j5X_QGJvefdWgoNOBUkhU_SYroc="
  },
  {
    id: "pedro",
    name: "Autógrafo do Pedro",
    price: 125000,
    image: "https://media.gettyimages.com/id/2266035342/pt/foto/rio-de-janeiro-brazil-pedro-of-flamengo-celebrates-after-scoring-his-teams-first-goal-during.jpg?s=612x612&w=0&k=20&c=M44EK0reMacNLkMuTcbff1C3u_Urqx-S5X2qYfRsZSY="
  },
  {
    id: "carrascal",
    name: "Autógrafo do Carrascal",
    price: 125000,
    image: "https://media.gettyimages.com/id/2302153387/pt/foto/rio-de-janeiro-brazil-carrascal-of-flamengo-celebrates-after-scoring-the-teams-third-goal.jpg?s=612x612&w=0&k=20&c=S0bFgzDiaOtv5eYlWD-FMLNUpfT1tks10wbaTXmaAcQ="
  },
  {
    id: "rossi",
    name: "Autógrafo do Rossi",
    price: 125000,
    image: "https://media.gettyimages.com/id/2237046524/pt/foto/topshot-flamengos-argentine-goalkeeper-agustin-rossi-celebrates-after-winning-the-penalty.jpg?s=612x612&w=0&k=20&c=9IdFm4-NJvFcdV04VRjUXKA3efbKT1_1QL0JvINLDdI="
  },
  {
    id: "plata",
    name: "Autógrafo do Plata",
    price: 125000,
    image: "https://media.gettyimages.com/id/2249100358/pt/foto/lima-peru-gonzalo-plata-of-flamengo-celebrates-with-the-trophy-after-winning-the-2025-copa.jpg?s=612x612&w=0&k=20&c=rYVosNBthestkaUIUDMZhLgMf19GeSvvjTDYmN1RXps="
  },
  {
    id: "ayrton_lucas",
    name: "Autógrafo do Ayrton Lucas",
    price: 125000,
    image: "https://media.gettyimages.com/id/2221766362/photo/philadelphia-pennsylvania-ayrton-lucas-of-cr-flamengo-looks-on-during-the-fifa-club-world-cup.jpg?s=612x612&w=0&k=20&c=MUTtNL9E59FUydoqG2TKc2qCUCNk6cPVqpj34tfYuCA="
  },


function loadInventory() {
  if (!fs.existsSync(INVENTORY_FILE)) {
    fs.writeFileSync(INVENTORY_FILE, "{}", "utf8");
  }

  return JSON.parse(fs.readFileSync(INVENTORY_FILE, "utf8"));
}

function getUserItems(userId) {
  const db = loadInventory();
  return Array.isArray(db[userId]) ? db[userId] : [];
}

function addUserItem(userId, itemId) {
  const db = loadInventory();

  if (!Array.isArray(db[userId])) {
    db[userId] = [];
  }

  if (db[userId].includes(itemId)) return false;

  db[userId].push(itemId);

  fs.writeFileSync(
    INVENTORY_FILE,
    JSON.stringify(db, null, 2),
    "utf8"
  );

  return true;
}

module.exports = {
  products,
  getUserItems,
  addUserItem
};

