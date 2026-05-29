const fs = require("fs");

const FILE = "./economy.json";

// carrega DB
function loadDB() {
  if (!fs.existsSync(FILE)) {
    return { users: {} };
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

// salva DB
function saveDB(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

const db = loadDB();

// garante estrutura base
if (!db.users) db.users = {};

// percorre usuários
for (const userId in db.users) {
  const user = db.users[userId];

  // avatar válido
  if (!user.avatar || typeof user.avatar !== "string" || !user.avatar.startsWith("http")) {
    user.avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  // username válido
  if (!user.username || typeof user.username !== "string" || user.username.trim().length === 0) {
    user.username = "Unknown";
  }

  // números seguros
  user.coins = Number(user.coins) || 0;
  user.work = Number(user.work) || 0;
}

saveDB(db);

console.log("✅ economy.json corrigido com sucesso");