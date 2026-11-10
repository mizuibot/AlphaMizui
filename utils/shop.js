
const fs = require("fs");
const path = require("path");

const INVENTORY_FILE = path.join(__dirname, "inventory.json");

const products = [
  { id: "pulgar", name: "Autógrafo do Erick Pulgar", price: 125000, image: "https://i.pinimg.com/originals/df/e9/75/dfe975d34b990d35a77eb515cca1df2c.jpg" },
  { id: "camisa_titular", name: "Camisa titular", price: 50000, image: "https://www.pngitem.com/pimgs/m/19-198067_clip-art-camisa-do-flamengo-png-flamengo-kit.png" },
  { id: "camisa_branca", name: "Camisa branca", price: 75000, image: "https://imgs.extra.com.br/1566275842/1xg.jpg" },
  { id: "touca", name: "Touca", price: 5000, image: "https://m.media-amazon.com/images/I/619+Wyd-SjL.jpg" },
  { id: "mascara", name: "Máscara", price: 12000, image: "https://images.tcdn.com.br/img/img_prod/811308/mascara_flamengo_of_1_2757_1_b60965e50a035a28b8576b48d57a1462.jpg" },
  { id: "chapeu", name: "Chapéu", price: 35000, image: "https://http2.mlstatic.com/D_Q_NP_2X_822348-MLB73878129105_012024-E-chapeu-zico-bucket-hat-simbolo-flamengo-dupla-face-oficial.webp" },
  { id: "calca", name: "Calça", price: 45000, image: "https://http2.mlstatic.com/D_Q_NP_2X_980153-MLB83535130740_042025-E-calca-moletom-de-frio-agasalho-algodao-flamengo-time-futebol.webp" },
  { id: "tenis_branco", name: "Tênis branco", price: 75000, image: "https://images.tcdn.com.br/img/img_prod/311840/tenis_reserva_hero_flamengo_branco_118012_3_79a6365eb04bc2d47d917dbc698300a1.jpg" },
  { id: "tenis_preto", name: "Tênis preto", price: 50000, image: "https://uploads.promoview.com.br/2023/12/adidas_flamengo_tenis_casual.jpg" },
  { id: "moletom_sem_capuz", name: "Moletom sem capuz", price: 60000, image: "https://imgcentauro-a.akamaihd.net/1024x1024/M16XN802A1.jpg" },
  { id: "moletom_com_capuz", name: "Moletom com capuz", price: 75000, image: "https://cdn.dooca.store/791/products/z_640x640+fill_ffffff.jpg?v=1739398684000&webp=0" },
  { id: "ingresso", name: "Ingresso do Maracanã", price: 50000, image: "https://artpoin.com/wp-content/uploads/2023/03/flamengo-artes-graficas-png25-724x1024.png" }
];

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

