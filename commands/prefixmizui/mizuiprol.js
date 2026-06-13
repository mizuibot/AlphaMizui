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
  bank: "https://image.pngaaa.com/541/6187541-middle.png",
  coins: "https://cdn-icons-png.magnific.com/256/9382/9382185.png",
  love: "https://static.vecteezy.com/system/resources/thumbnails/015/658/513/small/isometric-love-heart-icon-png.png",
  joinServer: "https://cdn.iconscout.com/icon/premium/png-256-thumb/porta-icon-svg-download-png-3258625.png?f=webp&w=128",
  joinDiscord: "https://media.gettyimages.com/id/1138819984/pt/vetorial/stick-figure-parachute-icon.jpg?s=612x612&w=0&k=20&c=Uh08Kg5VAAMh4LdLSkIIkBfPBb1Yd-ODLo7-ppdWh5Q",
  calendar: "https://static.vecteezy.com/system/resources/thumbnails/012/708/647/small/calendar-icon-calendar-sign-and-symbol-in-line-style-icon-vector.jpg"
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
      .resize(140, 140)
      .png()
      .toBuffer();

    const mask = Buffer.from(`
      <svg width="140" height="140">
        <circle cx="70" cy="70" r="70" fill="white"/>
      </svg>
    `);

    const roundedAvatar = await sharp(avatarBuffer)
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    // =====================
    // ÍCONES
    // =====================
    const coinIcon = (await getBuffer(ICONS.coins)).toString("base64");
    const bankIcon = (await getBuffer(ICONS.bank)).toString("base64");
    const loveIcon = (await getBuffer(ICONS.love)).toString("base64");
    const calendarIcon = (await getBuffer(ICONS.calendar)).toString("base64");

    // =====================
    // SVG
    // =====================
    const svg = `
<svg width="900" height="500">

  <image href="data:image/png;base64,${bgImage.toString("base64")}" width="900" height="500"/>

  <rect width="900" height="500" fill="rgba(0,0,0,0.55)"/>

  <image href="data:image/png;base64,${roundedAvatar.toString("base64")}" x="30" y="30" width="140" height="140"/>

  <!-- COINS -->
  <image href="data:image/png;base64,${coinIcon}" x="200" y="80" width="18" height="18"/>
  <text x="225" y="95" fill="white" font-size="16">Coins: ${wallet}</text>

  <!-- BANK -->
  <image href="data:image/png;base64,${bankIcon}" x="200" y="120" width="18" height="18"/>
  <text x="225" y="135" fill="white" font-size="16">Bank: ${bank}</text>

  <!-- TOTAL -->
  <image href="data:image/png;base64,${loveIcon}" x="200" y="160" width="18" height="18"/>
  <text x="225" y="175" fill="white" font-size="16">Total: ${total}</text>

  <!-- STATS -->
  <image href="data:image/png;base64,${calendarIcon}" x="200" y="220" width="18" height="18"/>
  <text x="225" y="235" fill="white" font-size="14">Hoje: ${today} | Semana: ${week}</text>

  <text x="225" y="255" fill="white" font-size="14">Mês: ${month} | Ano: ${year}</text>

  <!-- BIO -->
  <text x="30" y="230" fill="white" font-size="14">Bio: ${bio}</text>

  <!-- CASAMENTO -->
  <text x="30" y="260" fill="white" font-size="14">
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
