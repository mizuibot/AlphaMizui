const sharp = require("sharp");

async function createQuote({
  avatarUrl,
  text,
  username,
  displayName
}) {
  const WIDTH = 1200;
  const HEIGHT = 630;

  // Fundo preto
  const background = {
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#000000"
    }
  };

  // Baixa o avatar automaticamente
  const response = await fetch(avatarUrl);

  if (!response.ok) {
    throw new Error("Não foi possível baixar o avatar.");
  }

  const avatarBuffer = Buffer.from(await response.arrayBuffer());

  // Avatar grande à esquerda
  const avatar = await sharp(avatarBuffer)
    .resize(360, 360, {
      fit: "cover",
      position: "centre"
    })
    .png()
    .toBuffer();

  // Texto da imagem
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}">
      <style>
        .quote {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: 32px;
        }

        .name {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: 20px;
          font-weight: bold;
        }

        .username {
          fill: #777777;
          font-family: Arial, sans-serif;
          font-size: 16px;
        }
      </style>

      <text x="370" y="620" class="quote">
        ${escapeXml(text)}
      </text>

      <text x="370" y="665" class="name">
        — ${escapeXml(displayName)}
      </text>

      <text x="370" y="695" class="username">
        @${escapeXml(username)}
      </text>
    </svg>
  `;

  const textLayer = Buffer.from(svg);

  return await sharp(background)
    .composite([
      {
        input: avatar,
        left: 0,
        top: 460
      },
      {
        input: textLayer,
        left: 0,
        top: 0
      }
    ])
    .png()
    .toBuffer();
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = {
  createQuote
};
