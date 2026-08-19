const sharp = require("sharp");

async function createQuote({
  avatarUrl,
  text,
  username,
  displayName
}) {
  const WIDTH = 1200;
  const HEIGHT = 630;

  // =========================
  // CONFIGURAÇÕES DO LAYOUT
  // =========================

  const AVATAR_SIZE = 360;

  const AVATAR_X = 60;
  const AVATAR_Y = (HEIGHT - AVATAR_SIZE) / 2;

  const TEXT_X = 480;
  const TEXT_WIDTH = 650;

  // =========================
  // FUNDO
  // =========================

  const background = {
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#000000"
    }
  };

  // =========================
  // BAIXAR AVATAR
  // =========================

  const response = await fetch(avatarUrl);

  if (!response.ok) {
    throw new Error("Não foi possível baixar o avatar.");
  }

  const avatarBuffer = Buffer.from(
    await response.arrayBuffer()
  );

  // =========================
  // PREPARAR AVATAR
  // =========================

  const avatar = await sharp(avatarBuffer)
    .resize(AVATAR_SIZE, AVATAR_SIZE, {
      fit: "cover",
      position: "centre"
    })
    .png()
    .toBuffer();

  // =========================
  // PREPARAR TEXTO
  // =========================

  const quoteText = escapeXml(text);
  const nameText = escapeXml(displayName);
  const usernameText = escapeXml(username);

  // Quebra a mensagem em linhas
  const lines = wrapText(text, 38);

  const lineHeight = 42;

  const quoteHeight = lines.length * lineHeight;

  const nameY = 330 + quoteHeight / 2 + 35;
  const usernameY = nameY + 30;

  // =========================
  // SVG DO TEXTO
  // =========================

  let quoteLines = "";

  const startY =
    315 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    quoteLines += `
      <text
        x="${TEXT_X}"
        y="${startY + index * lineHeight}"
        class="quote"
      >
        ${escapeXml(line)}
      </text>
    `;
  });

  const svg = `
    <svg
      width="${WIDTH}"
      height="${HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
    >

      <style>

        .quote {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: 34px;
          font-weight: 500;
        }

        .name {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: 22px;
          font-weight: bold;
        }

        .username {
          fill: #777777;
          font-family: Arial, sans-serif;
          font-size: 18px;
        }

      </style>

      ${quoteLines}

      <text
        x="${TEXT_X}"
        y="${nameY}"
        class="name"
      >
        — ${nameText}
      </text>

      <text
        x="${TEXT_X}"
        y="${usernameY}"
        class="username"
      >
        @${usernameText}
      </text>

    </svg>
  `;

  const textLayer = Buffer.from(svg);

  // =========================
  // MONTAR IMAGEM FINAL
  // =========================

  return await sharp(background)
    .composite([
      {
        input: avatar,
        left: AVATAR_X,
        top: AVATAR_Y
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

// =========================
// QUEBRA DE TEXTO
// =========================

function wrapText(text, maxCharacters) {
  const words = String(text).split(" ");

  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length > maxCharacters) {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// =========================
// PROTEÇÃO XML
// =========================

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
