const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const { loadDB, getUser } = require("../../economy");

const STATS_FILE = path.resolve(__dirname, "../../stats.json");
const MARRIAGES_FILE = path.resolve(process.cwd(), "marriages.json");

// =====================
// LOAD HELPERS
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

    const profile = db[message.author.id] || {};
    const bio = profile.bio || "Sem biografia.";
    const createdAt = message.author.createdAt;
    const joinedAt = message.member.joinedAt;

    const user = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL({ extension: "png", size: 512 })
    );

    const wallet = BigInt(user.coins || "0");
    const bank = BigInt(user.bank || "0");

    const stats = loadStats();
    const guildStats = stats[message.guild.id] || {};
    const userStats = guildStats[message.author.id] || {};

    const today = userStats.today?.count || 0;
    const week = userStats.week?.count || 0;
    const month = userStats.month?.count || 0;
    const year = userStats.year?.count || 0;

    const marriages = loadMarriages();
    const married = marriages[message.author.id]?.partner;

    const total = wallet + bank;

    // =====================
    // IMAGENS
    // =====================
    const background =
      profile.background ||
      "https://i.imgur.com/3ZQ3Z9D.jpeg";

    const avatar =
      profile.customAvatar ||
      message.author.displayAvatarURL({ extension: "png", size: 512 });

    // =====================
    // DOWNLOAD IMAGES
    // =====================
    const bg = await fetch(background).then(r => r.arrayBuffer());
    const av = await fetch(avatar).then(r => r.arrayBuffer());

    const bgBuffer = Buffer.from(bg);
    const avBuffer = Buffer.from(av);

    // avatar circular
    const avatarCircle = await sharp(avBuffer)
      .resize(140, 140)
      .png()
      .toBuffer();

    const roundedAvatar = await sharp(avatarCircle)
      .composite([
        {
          input: Buffer.from(
            `<svg><circle cx="70" cy="70" r="70"/></svg>`
          ),
          blend: "dest-in"
        }
      ])
      .png()
      .toBuffer();

    // =====================
    // CARD SVG (TEXT OVERLAY)
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
📅 Discord: ${new Date(createdAt).toLocaleDateString("pt-BR")}
📍 Server: ${joinedAt ? new Date(joinedAt).toLocaleDateString("pt-BR") : "N/A"}

💍 ${married ? "Casado 💕" : "Solteiro 💔"}
`;

    const svg = `
<svg width="900" height="500">
  <image href="data:image/png;base64,${bgBuffer.toString("base64")}" width="900" height="500"/>
  <rect width="900" height="500" fill="rgba(0,0,0,0.55)"/>

  <image href="data:image/png;base64,${roundedAvatar.toString("base64")}" x="30" y="30" width="140" height="140"/>

  <text x="200" y="60" fill="white" font-size="22" font-family="Arial">
    ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>
</svg>
`;

    const image = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    return message.reply({
      files: [{ attachment: image, name: "prol.png" }]
    });
  }
};