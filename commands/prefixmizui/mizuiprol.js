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
  total: "https://static.vecteezy.com/system/resources/thumbnails/041/930/128/small/3d-money-bag-with-dollar-sign-and-coins-on-transparent-background-png.png"
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

    // =====================
    // FORMATADOR BIGINT
    // =====================
    function formatMoney(value) {
      const num = BigInt(value);

      const units = [
        { value: 1000000000000000000n, suffix: "Qi" },
        { value: 1000000000000000n, suffix: "Qa" },
        { value: 1000000000000n, suffix: "T" },
        { value: 1000000000n, suffix: "B" },
        { value: 1000000n, suffix: "M" },
        { value: 1000n, suffix: "K" }
      ];

      for (const unit of units) {
        if (num >= unit.value) {
          const whole = num / unit.value;
          const decimal = (num % unit.value) * 100n / unit.value;

          return `${whole}.${decimal.toString().padStart(2, "0")}${unit.suffix}`;
        }
      }

      return num.toString();
    }

    const walletText = formatMoney(wallet);
    const bankText = formatMoney(bank);
    const totalText = formatMoney(total);

    const bio =
  (profile.bio || "Sem biografia.").length > 60
    ? (profile.bio || "Sem biografia.").slice(0, 57) + "..."
    : profile.bio || "Sem biografia.";

    const background =
      profile.background ||
      "https://i.imgur.com/3ZQ3Z9D.jpeg";

    const avatar =
      profile.customAvatar ||
      message.author.displayAvatarURL({
        extension: "png",
        size: 512
      });


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
const married =
  marriages[userId] &&
  marriages[userId][0];

let marriedName = "Solteiro";

if (married) {
  try {
    const user = await message.client.users.fetch(married);
    marriedName = `Casado com: ${user.username}`;
  } catch {
    marriedName = "Casado";
  }
}
   const discordDate = new Date(
  message.author.createdTimestamp
).toLocaleDateString("pt-BR");

const serverDate = message.member?.joinedTimestamp
  ? new Date(message.member.joinedTimestamp)
      .toLocaleDateString("pt-BR")
  : "Desconhecida";

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
const totalIcon = (await getBuffer(ICONS.total)).toString("base64");

    // =====================
    // SVG
    // =====================

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, " ");

const svg = `
<svg width="1300" height="650" xmlns="http://www.w3.org/2000/svg">

<defs>
  <style>
    text {
      font-family: Arial, sans-serif;
      font-weight: 400;
    }
  </style>
</defs>

<!-- BACKGROUND -->
<image href="data:image/png;base64,${bgImage.toString("base64")}"
  width="1300" height="650" />

<!-- OVERLAY -->
<rect width="1300" height="650" fill="rgba(0,0,0,0.55)"/>

<!-- AVATAR -->
<image href="data:image/png;base64,${roundedAvatar.toString("base64")}"
  x="40" y="40" width="180" height="180"/>

<!-- COINS -->
<image href="data:image/png;base64,${coinIcon}"
  x="260" y="80" width="30" height="30"/>
<text x="300" y="102" fill="white" font-size="22">
Coins: ${esc(walletText)}
</text>

<!-- BANK -->
<image href="data:image/png;base64,${bankIcon}"
  x="260" y="140" width="30" height="30"/>
<text x="300" y="162" fill="white" font-size="22">
Bank: ${esc(bankText)}
</text>

<!-- TOTAL -->
<image href="data:image/png;base64,${totalIcon}"
  x="260" y="200" width="30" height="30"/>
<text x="300" y="222" fill="white" font-size="22">
Total: ${esc(totalText)}
</text>

<!-- STATS -->
<text x="260" y="300" fill="white" font-size="20">
Hoje: ${today} | Semana: ${week}
</text>

<text x="260" y="330" fill="white" font-size="20">
Mês: ${month} | Ano: ${year}
</text>

<!-- BIO -->
<text x="40" y="260" fill="white" font-size="20">
Bio: ${esc(bio)}
</text>

<!-- DATES -->
<text x="40" y="300" fill="white" font-size="18">
Discord: ${discordDate}
</text>

<text x="40" y="330" fill="white" font-size="18">
Servidor: ${serverDate}
</text>

<!-- CASAMENTO -->
<image href="data:image/png;base64,${loveIcon}"
  x="40" y="360" width="30" height="30"/>

<text x="80" y="382" fill="white" font-size="20">
${esc(marriedName)}
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
