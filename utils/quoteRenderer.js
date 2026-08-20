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
  const AVATAR_WIDTH = 420;

  // Onde começa o texto
  const TEXT_X = 455;

  // Linha azul grossa
  const BLUE_LINE_X = 540;
  const BLUE_LINE_WIDTH = 55;

  // Área do autor
  const AUTHOR_X = 680;

  // Tamanho das letras — NÃO ALTERADO
  const TEXT_SIZE = 38;
  const DISPLAY_NAME_SIZE = 38;
  const USERNAME_SIZE = 28;

  // =========================
  // AVATAR
  // =========================

  const avatar = await fetch(avatarUrl)
    .then(res => res.arrayBuffer())
    .then(buffer =>
      sharp(Buffer.from(buffer))
        .resize(AVATAR_WIDTH, HEIGHT, {
          fit: "cover",
          position: "center"
        })
        .png()
        .toBuffer()
    );

  // =========================
  // FUNDO PRETO
  // =========================

  const background = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 1
      }
    }
  });

  // =========================
  // TEXTO
  // =========================

  const escapedText = String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const escapedDisplayName = String(displayName || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const escapedUsername = String(username || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

    <!-- TEXTO DA FRASE -->
    <text
      x="${TEXT_X}"
      y="305"
      fill="white"
      font-family="Arial, sans-serif"
      font-size="${TEXT_SIZE}px"
      font-weight="400"
    >
      ${escapedText}
    </text>

    <!-- NOME -->
    <text
      x="${AUTHOR_X}"
      y="455"
      fill="#2457ff"
      font-family="Arial, sans-serif"
      font-size="${DISPLAY_NAME_SIZE}px"
      font-weight="400"
    >
      — ${escapedDisplayName}
    </text>

    <!-- USERNAME -->
    <text
      x="${AUTHOR_X + 105}"
      y="495"
      fill="#2457ff"
      font-family="Arial, sans-serif"
      font-size="${USERNAME_SIZE}px"
      font-weight="400"
    >
      @${escapedUsername}
    </text>

    <!-- LINHA AZUL -->
    <rect
      x="${BLUE_LINE_X}"
      y="0"
      width="${BLUE_LINE_WIDTH}"
      height="${HEIGHT}"
      fill="#1557ff"
    />

  </svg>
  `;

  // =========================
  // COMPOSIÇÃO
  // =========================

  return background
    .composite([
      {
        input: avatar,
        left: 0,
        top: 0
      },
      {
        input: Buffer.from(svg),
        left: 0,
        top: 0
      }
    ])
    .png()
    .toBuffer();
}

module.exports = {
  createQuote
};
