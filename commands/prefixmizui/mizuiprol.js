const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const { loadDB } = require("../../economy");

const STATS_FILE = path.resolve(__dirname, "../../stats.json");
const MARRIAGES_FILE = path.resolve(process.cwd(), "marriages.json");

// =====================
// HELPERS
// =====================
function loadStats() {
  if (!fs.existsSync(STATS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(MARRIAGES_FILE, "utf8"));
  } catch {
    return {};
  }
}

// =====================
// COMMAND
// =====================
module.exports = {
  name: "prol",

  async execute(message) {
    const db = loadDB();

    const userId = message.author.id;

    // 🔥 SEM getUser (isso estava quebrando seus dados)
    const profile = db[userId] || {};

    const wallet = BigInt(profile.coins || "0");
    const bank = BigInt(profile.bank || "0");
    const total = wallet + bank;

    const bio = profile.bio || "Sem biografia.";
    const background =
      profile.background ||
      "https://i.imgur.com/3ZQ3Z9D.jpeg";

    const avatar =
      profile.customAvatar ||
      message.author.displayAvatarURL({ extension: "png", size: 512 });

    const createdAt = message.author.createdAt;
    const joinedAt = message.member?.joinedAt;

    // =====================
    // STATS
    // =====================
    const stats = loadStats();
    const guildStats = stats[message.guild.id] || {};
    const userStats = guildStats[userId] || {};

    const today = userStats.today?.count || 0;
    const week = userStats.week?.count || 0;
    const month = userStats.month?.count || 0;
    const year = userStats.year?.count || 0;

    // =====================
    // CASAMENTO
    // =====================
    const marriages = loadMarriages();
    const married = marriages[userId]?.partner;

    // =====================
    // IMAGENS
    // =====================
    const bgBuffer = Buffer.from(
      await fetch(background).then(r => r.arrayBuffer())
    );

    const avBuffer = Buffer.from(
      await fetch(avatar).then(r => r.arrayBuffer())
    );

    // avatar redondo
    const avatarResized = await sharp(avBuffer)
      .resize(140, 140)
      .png()
      .toBuffer();

    const roundedAvatar = await sharp(avatarResized)
      .composite([
        {
          input: Buffer.from(`
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="70" fill="white"/>
            </svg>
          `),
          blend: "dest-in"
        }
      ])
      .png()
      .toBuffer();

    // =====================
    // TEXTO
    // =====================
    const text = `
${message.author.username}

💰 Coins: ${wallet}
🏦 Bank: ${bank}
💎 Total: ${total}

💬 Hoje: ${today}
📅 Semana: ${week}
🗓️ Mês: ${month}
📆 Ano: ${year}

📝 Bio: ${bio}
📅 Criado: ${new Date(createdAt).toLocaleDateString("pt-BR")}
📍 Server: ${joinedAt ? new Date(joinedAt).toLocaleDateString("pt-BR") : "N/A"}

💍 ${married ? "Casado 💕" : "Solteiro 💔"}
`;

    // =====================
    // SVG FINAL
    // =====================
    const svg = `
<svg width="900" height="500">

  <image href="data:image/png;base64,${bgBuffer.toString("base64")}" width="900" height="500"/>
  <rect width="900" height="500" fill="rgba(0,0,0,0.55)"/>

  <image href="data:image/png;base64,${roundedAvatar.toString("base64")}" x="30" y="30" width="140" height="140"/>

  <text x="200" y="60" fill="white" font-size="18" font-family="Arial">
    ${text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .split("\n")
      .map((line, i) => `<tspan x="200" dy="${i === 0 ? 0 : 22}">${line}</tspan>`)
      .join("")}
  </text>

</svg>
`;

    const image = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    return message.reply({
      files: [
        {
          attachment: image,
          name: "prol.png"
        }
      ]
    });
  }
};