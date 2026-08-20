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
  // CONFIGURAÇÕES
  // =========================

  // Largura que o avatar ocupa
  const AVATAR_WIDTH = 900;

  // Posição horizontal do texto
  const TEXT_X = 500;

  // Largura máxima do texto
  const TEXT_MAX_WIDTH = 600;

  // =========================
  // FUNDO PRETO
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
    .resize(AVATAR_WIDTH, HEIGHT, {
      fit: "cover",
      position: "left"
    })
    .png()
    .toBuffer();

  // =========================
  // SOMBRA SOBRE O AVATAR
  // =========================

  const gradient = Buffer.from(`
    <svg
      width="${AVATAR_WIDTH}"
      height="${HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
    >

      <defs>

        <linearGradient
          id="shadow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >

          <stop
            offset="0%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <stop
            offset="55%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <stop
            offset="72%"
            stop-color="#000000"
            stop-opacity="0.35"
          />

          <stop
            offset="85%"
            stop-color="#000000"
            stop-opacity="0.75"
          />

          <stop
            offset="100%"
            stop-color="#000000"
            stop-opacity="1"
          />

        </linearGradient>

      </defs>

      <rect
        width="${AVATAR_WIDTH}"
        height="${HEIGHT}"
        fill="url(#shadow)"
      />

    </svg>
  `);

  // =========================
  // PREPARAR TEXTO
  // =========================

  const lines = wrapText(
    text,
    34,
    TEXT_MAX_WIDTH
  );

  // Limite para não estourar a imagem
  const visibleLines = lines.slice(0, 7);

  const lineHeight = 44;

  const quoteHeight =
    visibleLines.length * lineHeight;

  // Centraliza o bloco da mensagem
  let startY =
    (HEIGHT - quoteHeight) / 2 + 32;

  let quoteLines = "";

  visibleLines.forEach((line, index) => {
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

  // Nome abaixo da mensagem
  const nameY =
    startY +
    visibleLines.length * lineHeight +
    18;

  // Username abaixo do nome
  const usernameY =
    nameY + 30;

  // =========================
  // SVG DO TEXTO
  // =========================

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
          font-size: 36px;
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
        — ${escapeXml(displayName)}
      </text>

      <text
        x="${TEXT_X}"
        y="${usernameY}"
        class="username"
      >
        @${escapeXml(username)}
      </text>

    </svg>
  `;

  const textLayer = Buffer.from(svg);

  // =========================
  // MONTAR IMAGEM FINAL
  // =========================

  return await sharp(background)
    .composite([

      // 1. Avatar
      {
        input: avatar,
        left: 0,
        top: 0
      },

      // 2. Sombra por cima do avatar
      {
        input: gradient,
        left: 0,
        top: 0
      },

      // 3. Texto por cima da sombra
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

function wrapText(
  text,
  maxCharacters,
  maxWidth
) {
  const words = String(text).split(/\s+/);

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
// ESCAPAR XML
// =========================

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// =========================
// EXPORT
// =========================

module.exports = {
  createQuote
};
