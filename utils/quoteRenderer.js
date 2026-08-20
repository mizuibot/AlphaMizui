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

  // Avatar ocupa bastante da imagem,
  // mas o corte fica focado mais à esquerda.
  const AVATAR_WIDTH = 820;

  // Texto mais para a direita
  const TEXT_X = 620;

  // Limite horizontal do texto
  const TEXT_MAX_WIDTH = 500;

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
  // A sombra começa sobre o avatar
  // e vai ficando preta gradualmente.
  //
  // Ela é maior para criar aquele
  // desaparecimento suave da imagem.
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

          <!-- Avatar completamente visível -->
          <stop
            offset="0%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <stop
            offset="42%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <!-- Começa a escurecer -->
          <stop
            offset="55%"
            stop-color="#000000"
            stop-opacity="0.12"
          />

          <stop
            offset="65%"
            stop-color="#000000"
            stop-opacity="0.35"
          />

          <stop
            offset="75%"
            stop-color="#000000"
            stop-opacity="0.60"
          />

          <stop
            offset="85%"
            stop-color="#000000"
            stop-opacity="0.82"
          />

          <!-- Preto no final -->
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
    34
  );

  // Evita que texto demais ultrapasse a imagem
  const visibleLines = lines.slice(0, 7);

  const lineHeight = 44;

  const quoteHeight =
    visibleLines.length * lineHeight;

  // Centro vertical da mensagem
  const startY =
    (HEIGHT - quoteHeight) / 2 + 35;

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

  // =========================
  // NOME E USERNAME
  // =========================

  const nameY =
    startY +
    visibleLines.length * lineHeight +
    18;

  const usernameY =
    nameY + 30;

  // =========================
  // CAMADA DE TEXTO
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
      // Avatar
      {
        input: avatar,
        left: 0,
        top: 0
      },

      // Sombra por cima do avatar
      {
        input: gradient,
        left: 0,
        top: 0
      },

      // Texto por cima da sombra
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
// QUEBRAR TEXTO
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
