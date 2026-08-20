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

  // O avatar vai até a posição da linha azul da referência
  const AVATAR_WIDTH = 540;

  // Onde começa a mensagem
  const TEXT_X = 455;

  // Posição do nome do usuário
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
  // ESCAPAR TEXTOS
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

  // =========================
  // TEXTO
  // =========================

  const svg = `
  <svg
    width="${WIDTH}"
    height="${HEIGHT}"
    xmlns="http://www.w3.org/2000/svg"
  >

    <!-- MENSAGEM DO USUÁRIO -->
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

    <!-- NOME DO USUÁRIO -->
    <text
      x="${AUTHOR_X}"
      y="455"
      fill="white"
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
      fill="white"
      font-family="Arial, sans-serif"
      font-size="${USERNAME_SIZE}px"
      font-weight="400"
    >
      @${escapedUsername}
    </text>

  </svg>
  `;

  // =========================
  // COMPOSIÇÃO FINAL
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
