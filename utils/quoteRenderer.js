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

  // O avatar ocupa o lado esquerdo
  const AVATAR_WIDTH = 760;

  // Onde o texto começa
  const TEXT_X = 790;

  // Largura disponível para o texto
  const TEXT_MAX_WIDTH = 360;

  // Espaçamento entre linhas
  const LINE_HEIGHT = 44;

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
      position: "left"
    })
    .png()
    .toBuffer();

  // =========================
  // SOMBRA
  // =========================
  //
  // A sombra é MAIOR que o avatar.
  //
  // Ela começa ainda dentro da imagem,
  // atravessa a borda do avatar e
  // termina completamente preta.
  //

  const gradient = Buffer.from(`
    <svg
      width="${WIDTH}"
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
            offset="48%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <stop
            offset="62%"
            stop-color="#000000"
            stop-opacity="0.15"
          />

          <stop
            offset="72%"
            stop-color="#000000"
            stop-opacity="0.45"
          />

          <stop
            offset="80%"
            stop-color="#000000"
            stop-opacity="0.72"
          />

          <stop
            offset="88%"
            stop-color="#000000"
            stop-opacity="0.92"
          />

          <stop
            offset="96%"
            stop-color="#000000"
            stop-opacity="1"
          />

          <stop
            offset="100%"
            stop-color="#000000"
            stop-opacity="1"
          />

        </linearGradient>

      </defs>

      <rect
        width="${WIDTH}"
        height="${HEIGHT}"
        fill="url(#shadow)"
      />

    </svg>
  `);

  // =========================
  // TEXTO
  // =========================

  const lines = wrapText(
    text,
    30
  );

  // Evita que uma mensagem enorme
  // estoure a imagem
  const visibleLines = lines.slice(0, 7);

  const quoteHeight =
    visibleLines.length * LINE_HEIGHT;

  // Centraliza verticalmente
  const startY =
    (HEIGHT - quoteHeight) / 2 + 32;

  let quoteLines = "";

  visibleLines.forEach((line, index) => {
    quoteLines += `
      <text
        x="${TEXT_X}"
        y="${startY + index * LINE_HEIGHT}"
        class="quote"
      >
        ${escapeXml(line)}
      </text>
    `;
  });

  // =========================
  // NOME E USERNAME
  // =========================

  const nameY =
    startY +
    visibleLines.length * LINE_HEIGHT +
    20;

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
  // IMAGEM FINAL
  // =========================

  return await sharp(background)
    .composite([
      // Avatar à esquerda
      {
        input: avatar,
        left: 0,
        top: 0
      },

      // Sombra atravessando a borda
      // do avatar e entrando no preto
      {
        input: gradient,
        left: 0,
        top: 0
      },

      // Texto por cima
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
