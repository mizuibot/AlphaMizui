const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { loadDB } = require("../../economy");

const STATS_FILE = path.resolve(__dirname, "../../stats.json");
const MARRIAGES_FILE = path.resolve(process.cwd(), "marriages.json");

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
const ICONS = {
  bank: "https://static.vecteezy.com/system/resources/thumbnails/060/665/567/small/charming-chibi-bank-building-digital-art-transparent-background-playful-design-whimsical-style-free-png.png",
  coins: "https://cdn-icons-png.magnific.com/256/9382/9382185.png",
  love: "https://static.vecteezy.com/system/resources/thumbnails/015/658/513/small/isometric-love-heart-icon-png.png",
  msg: "https://static.vecteezy.com/system/resources/thumbnails/012/708/647/small/calendar-icon-calendar-sign-and-symbol-in-line-style-icon-vector.jpg"
};

async function getBuffer(url) {
  return Buffer.from(await fetch(url).then(r => r.arrayBuffer()));
}

// =====================
module.exports = {
  name: "prol",

  async execute(message) {
    const db = loadDB();
    const userId = message.author.id;

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
    const bgImage = await sharp(await getBuffer(background))
      .resize(900, 500)
      .png()
      .toBuffer();

    const avatarBuffer = await sharp(await getBuffer(avatar))
      .resize(160, 160)
      .png()
      .toBuffer();

    const mask = Buffer.from(`
      <svg width="160" height="160">
        <circle cx="80" cy="80" r="80" fill="white"/>
      </svg>
    `);

    const roundedAvatar = await sharp(avatarBuffer)
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    // =====================
    // ÍCONES (MAIORES)
    // =====================
    const coinIcon = (await getBuffer(ICONS.coins)).toString("base64");
    const bankIcon = (await getBuffer(ICONS.bank)).toString("base64");
    const loveIcon = (await getBuffer(ICONS.love)).toString("base64");
    const msgIcon = (await getBuffer(ICONS.msg)).toString("base64");

    // =====================
    // SVG
    // =====================
    const svg = `
<svg width="900" height="500">

  <image href="data:image/png;base64,${bgImage.toString("base64")}" width="900" height="500"/>
  <rect width="900" height="500" fill="rgba(0,0,0,0.55)"/>

  <image href="data:image/png;base64,${roundedAvatar.toString("base64")}" x="30" y="30" width="160" height="160"/>

  <!-- COINS -->
  <image href="data:image/png;base64,${coinIcon}" x="220" y="90" width="28" height="28"/>
  <text x="260" y="110" fill="white" font-size="20">Coins: ${wallet}</text>

  <!-- BANK -->
  <image href="data:image/png;base64,${bankIcon}" x="220" y="140" width="28" height="28"/>
  <text x="260" y="160" fill="white" font-size="20">Bank: ${bank}</text>

  <!-- TOTAL -->
  <image href="data:image/png;base64,${loveIcon}" x="220" y="190" width="28" height="28"/>
  <text x="260" y="210" fill="white" font-size="20">Total: ${total}</text>

  <!-- MSG STATS (SEM CALENDÁRIO, TUDO AQUI) -->
  <image href="data:image/png;base64,${msgIcon}" x="220" y="250" width="28" height="28"/>

  <text x="260" y="270" fill="white" font-size="18">
    Hoje: ${today} | Semana: ${week}
  </text>

  <text x="260" y="295" fill="white" font-size="18">
    Mês: ${month} | Ano: ${year}
  </text>

  <!-- BIO -->
  <text x="30" y="240" fill="white" font-size="18">
    Bio: ${bio}
  </text>

  <!-- CASAMENTO -->
  <text x="30" y="270" fill="white" font-size="18">
    Status: ${married ? "Casado 💕" : "Solteiro 💔"}
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
