const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const { getUser, loadDB } = require("../../economy");

// =====================
// FILES
// =====================
const STATS_FILE = path.resolve(
  __dirname,
  "../../stats.json"
);

const MARRIAGES_FILE = path.resolve(
  process.cwd(),
  "marriages.json"
);

// =====================
// LOAD STATS
// =====================
function loadStats() {
  if (!fs.existsSync(STATS_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));
  } catch {
    return {};
  }
}

// =====================
// LOAD MARRIAGES
// =====================
function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(MARRIAGES_FILE, "utf8"));
  } catch {
    return {};
  }
}

// =====================
// RANK GLOBAL
// =====================
function getRank(db, userId) {
  const users = Object.entries(db.users || {});

  const sorted = users.sort((a, b) => {
    const aTotal =
      (BigInt(a[1]?.coins || "0") +
        BigInt(a[1]?.bank || "0"));

    const bTotal =
      (BigInt(b[1]?.coins || "0") +
        BigInt(b[1]?.bank || "0"));

    if (bTotal > aTotal) return 1;
    if (bTotal < aTotal) return -1;
    return 0;
  });

  const index = sorted.findIndex(([id]) => id === userId);

  if (index === -1) return "Unranked";

  return `#${index + 1}`;
}

// =====================
// COMMAND
// =====================
module.exports = {
  name: "prol",

  async execute(message) {

    const db = loadDB();

    const user = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL({ dynamic: true, size: 512 })
    );

    const rank = getRank(db, message.author.id);

    // =====================
    // CASAMENTO
    // =====================
    const marriages = loadMarriages();

    const raw = marriages[message.author.id];

    const marriedTo = Array.isArray(raw)
      ? raw
      : raw
        ? [raw]
        : [];

    // =====================
    // STATS
    // =====================
    const stats = loadStats();

    const guildStats = stats[message.guild.id] || {};
    const userStats = guildStats[message.author.id] || {};

    const todayCount = userStats.today?.count || 0;

    const weekCount =
      typeof userStats.week === "object"
        ? userStats.week?.count || 0
        : userStats.week || 0;

    const monthCount =
      typeof userStats.month === "object"
        ? userStats.month?.count || 0
        : userStats.month || 0;

    const yearCount =
      typeof userStats.year === "object"
        ? userStats.year?.count || 0
        : userStats.year || 0;

    const totalCount = userStats.total || 0;

    // =====================
    // ECONOMIA
    // =====================
    const wallet = BigInt(user.coins || "0");
    const bank = BigInt(user.bank || "0");

    let totalMoney = wallet + bank;

    if (marriedTo.length > 0) {

      const partnerId = marriedTo[0];

      const partner = getUser(
        partnerId,
        "Unknown",
        ""
      );

      totalMoney =
        wallet +
        bank +
        BigInt(partner.coins || "0") +
        BigInt(partner.bank || "0");
    }

    // =====================
    // TEXTO DA IMAGEM
    // =====================
    const text = `
Perfil de ${message.author.username}

Carteira: ${wallet.toString()} MZCoins
Banco: ${bank.toString()} MZCoins
Patrimônio: ${totalMoney.toString()} MZCoins
Rank: ${rank}

Works: ${user.work || 0}
Dailys: ${user.daily || 0}

Hoje: ${todayCount}
Semana: ${weekCount}
Mês: ${monthCount}
Ano: ${yearCount}
Total: ${totalCount}

Status:
${
  marriedTo.length > 0
    ? marriedTo.map(id => `<@${id}>`).join(", ") + " 💕"
    : "💔 Solteiro"
}
`;

    // =====================
    // GERAR IMAGEM (SHARP)
    // =====================
    const svg = `
<svg width="900" height="600">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="20" y="40" fill="#ffffff" font-size="14" font-family="monospace">
    ${text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .split("\n")
      .map((line, i) => `<tspan x="20" dy="${i === 0 ? 0 : 18}">${line}</tspan>`)
      .join("")}
  </text>
</svg>
`;

    const image = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    // =====================
    // SEND IMAGE
    // =====================
    return message.reply({
      files: [{
        attachment: image,
        name: "prol.png"
      }]
    });
  }
};