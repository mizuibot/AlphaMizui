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
  // AVATAR
  // =========================

  const AVATAR_WIDTH = 760;
  const AVATAR_HEIGHT = 630;

  const response = await fetch(avatarUrl);

  if (!response.ok) {
    throw new Error("Não foi possível baixar o avatar.");
  }

  const avatarBuffer = Buffer.from(
    await response.arrayBuffer()
  );

  const avatar = await sharp(avatarBuffer)
    .resize(AVATAR_WIDTH, AVATAR_HEIGHT, {
      fit: "cover",
      position: "centre"
    })
    .png()
    .toBuffer();

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
  // SOMBRA SOBRE O AVATAR
  // =========================
  //
  // Transparente no começo
  // e vai ficando preto na direita.
  //

  const shadowSvg = `
    <svg width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient
          id="shadow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="35%"
            stop-color="black"
            stop-opacity="0"
          />

          <stop
            offset="52%"
            stop-color="black"
            stop-opacity="0.05"
          />

          <stop
            offset="65%"
            stop-color="black"
            stop-opacity="0.45"
          />

          <stop
            offset="75%"
            stop-color="black"
            stop-opacity="0.85"
          />

          <stop
            offset="82%"
            stop-color="black"
            stop-opacity="1"
          />
        </linearGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="${WIDTH}"
        height="${HEIGHT}"
        fill="url(#shadow)"
      />
    </svg>
  `;

  const shadowLayer = Buffer.from(shadowSvg);

  // =========================
  // TEXTO
  // =========================

  const TEXT_X = 800;
  const TEXT_WIDTH = 350;

  const lines = wrapText(text, 24);

  const LINE_HEIGHT = 42;

  const quoteHeight = lines.length * LINE_HEIGHT;

  const quoteStartY =
    (HEIGHT - quoteHeight) / 2;

  let quoteLines = "";

  lines.forEach((line, index) => {
    quoteLines += `
      <text
        x="${TEXT_X}"
        y="${quoteStartY + (index + 1) * LINE_HEIGHT}"
        class="quote"
      >
        ${escapeXml(line)}
      </text>
    `;
  });

  const nameY =
    quoteStartY +
    quoteHeight +
    45;

  const usernameY =
    nameY + 30;

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
          font-size: 38px;
        }

        .name {
          fill: white;
          font-family: Arial, sans-serif;
          font-size: 23px;
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
  // MONTAGEM FINAL
  // =========================

  return await sharp(background)
    .composite([
      // Avatar ocupando o lado esquerdo inteiro
      {
        input: avatar,
        left: 0,
        top: 0
      },

      // Sombra que mistura o avatar com o fundo
      {
        input: shadowLayer,
        left: 0,
        top: 0
      },

      // Texto
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
  let current = "";

  for (const word of words) {
    const test = current
      ? `${current} ${word}`
      : word;

    if (test.length > maxCharacters) {
      if (current) {
        lines.push(current);
      }

      current = word;
    } else {
      current = test;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

// =========================
// ESCAPE XML
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
