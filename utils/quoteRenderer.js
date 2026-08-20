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
  // LAYOUT
  // =========================

  // Avatar ocupa toda a altura
  const AVATAR_WIDTH = 420;

  // Texto começa mais perto do avatar
  const TEXT_X = 455;

  // Espaço disponível para o texto
  const TEXT_WIDTH = 680;

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
  // AVATAR
  // =========================

  const avatar = await sharp(avatarBuffer)
    .resize(AVATAR_WIDTH, HEIGHT, {
      fit: "cover",
      position: "centre"
    })
    .png()
    .toBuffer();

  // =========================
  // QUEBRAR TEXTO
  // =========================

  const lines = wrapText(text, 32);

  const FONT_SIZE = 34;
  const LINE_HEIGHT = 43;

  const totalTextHeight = lines.length * LINE_HEIGHT;

  let startY =
    (HEIGHT - totalTextHeight) / 2 + FONT_SIZE;

  // =========================
  // TEXTO DA MENSAGEM
  // =========================

  let quoteLines = "";

  for (let i = 0; i < lines.length; i++) {
    quoteLines += `
      <text
        x="${TEXT_X}"
        y="${startY + i * LINE_HEIGHT}"
        class="quote"
      >
        ${escapeXml(lines[i])}
      </text>
    `;
  }

  // =========================
  // NOME E USERNAME
  // =========================

  const nameY =
    startY + totalTextHeight + 30;

  const usernameY = nameY + 30;

  // =========================
  // SVG
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
          font-size: ${FONT_SIZE}px;
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
  // MONTAR IMAGEM
  // =========================

  return await sharp(background)
    .composite([
      {
        input: avatar,
        left: 0,
        top: 0
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
  const words = String(text).split(/\s+/);

  const lines = [];
  let currentLine = "";

  for (const word of words) {

    // Palavra gigantesca
    // quebra ela sozinha para nunca sair da imagem
    if (word.length > maxCharacters) {

      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      for (let i = 0; i < word.length; i += maxCharacters) {
        lines.push(
          word.slice(i, i + maxCharacters)
        );
      }

      continue;
    }

    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length > maxCharacters) {
      lines.push(currentLine);
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

module.exports = {
  createQuote
};
