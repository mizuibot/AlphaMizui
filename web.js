require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===================== STATIC =====================
app.use(express.static(__dirname));

// ===================== CORS =====================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ===================== FUNÇÃO AUXILIAR =====================
function getGuildRanking(guildId) {

  const db = JSON.parse(
    fs.readFileSync("./guild-economy.json", "utf8")
  );

  const guild = db.guilds?.[guildId];

  if (!guild || !guild.users) return [];

  return Object.entries(guild.users)
    .map(([id, data]) => ({
      id,
      name: data.username || data.name || "Unknown",
      avatar: data.avatar || "https://cdn.discordapp.com/embed/avatars/0.png",
      coins: Number(data.coins) || 0
    }))
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 15);
}

// ===================== GLOBAL API =====================
app.get("/leaderboard", (req, res) => {

  try {

    const db = JSON.parse(
      fs.readFileSync("./economy.json", "utf8")
    );

    const ranking = Object.entries(db.users || {})
      .map(([id, data]) => ({
        id,
        name: data.username || "Unknown",
        avatar: data.avatar || "https://cdn.discordapp.com/embed/avatars/0.png",
        coins: Number(data.coins) || 0
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 15)
      .map((u, i) => ({
        position: i + 1,
        ...u
      }));

    res.json(ranking);

  } catch (err) {
    console.log("ERRO GLOBAL:", err);
    res.json([]);
  }
});

// ===================== GUILD API =====================
app.get("/leaderboard/:guildId", (req, res) => {

  try {

    const ranking = getGuildRanking(req.params.guildId)
      .map((u, i) => ({
        position: i + 1,
        ...u
      }));

    res.json(ranking);

  } catch (err) {
    console.log("ERRO GUILD:", err);
    res.json([]);
  }
});

// ===================== 🔥 PASSO 1: RENDER HTML (LOCAL IMAGEM) =====================
app.get("/leaderboard-img/:guildId", (req, res) => {

  const ranking = getGuildRanking(req.params.guildId);

  let html = `
  <html>
  <head>
  <style>
    body {
      margin:0;
      font-family: Arial;
      background: radial-gradient(circle at top, #14001f, #000);
      color:white;
      padding:20px;
    }

    h1 {
      text-align:center;
      color:#ff66c4;
      text-shadow:0 0 10px #ff1493;
    }

    .card {
      display:flex;
      justify-content:space-between;
      padding:12px;
      margin:8px;
      background:#12001f;
      border-left:4px solid #ff1493;
      border-radius:10px;
    }

    .rank {
      width:40px;
      color:#aaa;
      font-weight:bold;
    }
  </style>
  </head>
  <body>

  <h1>🏆 Leaderboard</h1>
  `;

  ranking.forEach((u, i) => {

    html += `
      <div class="card">
        <div class="rank">#${i + 1}</div>
        <div>${u.name}</div>
        <div>${u.coins} coins</div>
      </div>
    `;
  });

  html += `</body></html>`;

  res.send(html);
});

// ===================== PÁGINAS =====================
app.get("/global", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/guild", (req, res) => {
  res.sendFile(path.join(__dirname, "guild.html"));
});

// ===================== HOME =====================
app.get("/", (req, res) => {
  res.redirect("/global");
});

// ===================== START =====================
app.listen(PORT, () => {
  console.log("🌐 WEB ONLINE");
  console.log("GLOBAL: http://127.0.0.1:3000/global");
  console.log("GUILD:  http://127.0.0.1:3000/guild?guild=ID");
  console.log("IMG:    http://127.0.0.1:3000/leaderboard-img/ID");
});