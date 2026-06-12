require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


// ===================== CACHE GLOBAL =====================
let economyCache = { users: {} };
let guildCache = { guilds: {} };

// carrega inicial
function loadCache() {
  try {
    economyCache = JSON.parse(fs.readFileSync("./economy.json", "utf8"));
  } catch (e) {
    console.log("ERRO ECONOMY CACHE:", e.message);
  }

  try {
    guildCache = JSON.parse(fs.readFileSync("./guild-economy.json", "utf8"));
  } catch (e) {
    console.log("ERRO GUILD CACHE:", e.message);
  }
}

// atualiza a cada 30s
setInterval(loadCache, 30000);
loadCache();


// ===================== RANK GUILD =====================
function getGuildRanking(guildId) {
  const guild = guildCache?.guilds?.[guildId];
  if (!guild?.users) return [];

  return Object.entries(guild.users)
    .map(([id, data]) => ({
      id,
      name: data.username || data.name || "Unknown",
      coins: Number(data.coins) || 0
    }))
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 15);
}


// ===================== GLOBAL SVG =====================
app.get("/leaderboard-img-global", (req, res) => {
  try {
    const ranking = Object.entries(economyCache.users || {})
      .map(([id, data]) => ({
        name: data.username || "Unknown",
        coins: Number(data.coins) || 0
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);

    let items = "";

    for (let i = 0; i < ranking.length; i++) {
      const u = ranking[i];
      items += `<text x="50" y="${80 + i * 28}" fill="white" font-size="18">
#${i + 1} ${u.name} - ${u.coins}
</text>`;
    }

    const svg = `
<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="black"/>
  <text x="50" y="40" fill="gold" font-size="26">🏆 GLOBAL LEADERBOARD</text>
  ${items}
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=30");

    return res.status(200).send(svg);

  } catch (err) {
    console.log("ERRO GLOBAL IMG:", err);
    return res.status(500).send("Erro");
  }
});


// ===================== GUILD SVG =====================
app.get("/leaderboard-img/:guildId", (req, res) => {
  try {
    const ranking = getGuildRanking(req.params.guildId);

    let items = "";

    for (let i = 0; i < ranking.length; i++) {
      const u = ranking[i];
      items += `<text x="50" y="${80 + i * 28}" fill="white" font-size="18">
#${i + 1} ${u.name} - ${u.coins}
</text>`;
    }

    const svg = `
<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#111"/>
  <text x="50" y="40" fill="#ff66c4" font-size="26">🏰 Leaderboard do Servidor</text>
  ${items}
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=30");

    return res.status(200).send(svg);

  } catch (err) {
    console.log("ERRO GUILD IMG:", err);
    return res.status(500).send("Erro");
  }
});


// ===================== JSON API =====================
app.get("/leaderboard", (req, res) => {
  try {
    const ranking = Object.entries(economyCache.users || {})
      .map(([id, data]) => ({
        id,
        name: data.username || "Unknown",
        coins: Number(data.coins) || 0
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 15)
      .map((u, i) => ({
        position: i + 1,
        ...u
      }));

    res.json(ranking);
  } catch {
    res.json([]);
  }
});


// ===================== HOME =====================
app.get("/", (req, res) => {
  res.redirect("/global");
});

app.get("/global", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/guild", (req, res) => {
  res.sendFile(path.join(__dirname, "guild.html"));
});


// ===================== START =====================
app.listen(PORT, () => {
  console.log("🌐 WEB ONLINE");
  console.log("GLOBAL IMG: /leaderboard-img-global");
  console.log("GUILD IMG: /leaderboard-img/:guildId");
});