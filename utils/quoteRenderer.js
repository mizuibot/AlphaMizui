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

  // Avatar termina exatamente na posição da linha
  const AVATAR_WIDTH = 540;

  // =========================
  // SOMBRA DO AVATAR
  // =========================

  // A sombra começa dentro do avatar
  // e vai ficando preta até o final dele.
  const SHADOW_START = 350;
  const SHADOW_END = AVATAR_WIDTH;

  // Limites da área da mensagem
  const TEXT_X = 580;
  const TEXT_MAX_X = 1085;
  const TEXT_MAX_WIDTH = TEXT_MAX_X - TEXT_X;

  // Mensagem 15px mais para cima
  const TEXT_Y = 290;

  // Espaçamento entre linhas
  const LINE_HEIGHT = 48;

  // Área do autor
  const AUTHOR_X = 680;

  // Tamanho das letras — NÃO ALTERADO
  const TEXT_SIZE = 38;
  const DISPLAY_NAME_SIZE = 38;
  const USERNAME_SIZE = 28;

  // Nome e username mais para baixo
  const DISPLAY_NAME_Y = 535;
  const USERNAME_Y = 575;

  // =========================
  // ESCAPAR TEXTO
  // =========================

  function escapeXML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // =========================
  // ESTIMAR LARGURA DO TEXTO
  // =========================

  function estimateTextWidth(text) {
    let width = 0;

    for (const char of text) {
      if (char === " ") {
        width += TEXT_SIZE * 0.28;
      } else if (/[A-ZÁÀÃÂÉÊÍÓÔÕÚÇ]/.test(char)) {
        width += TEXT_SIZE * 0.65;
      } else if (/[a-záàãâéêíóôõúç]/.test(char)) {
        width += TEXT_SIZE * 0.52;
      } else if (/[0-9]/.test(char)) {
        width += TEXT_SIZE * 0.55;
      } else if (/[.,!?;:'"`]/.test(char)) {
        width += TEXT_SIZE * 0.28;
      } else {
        width += TEXT_SIZE * 0.50;
      }
    }

    return width;
  }

  // =========================
  // QUEBRA AUTOMÁTICA
  // =========================

  function wrapText(text) {
    const words = String(text || "")
      .trim()
      .split(/\s+/);

    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine
        ? `${currentLine} ${word}`
        : word;

      const width = estimateTextWidth(testLine);

      if (width <= TEXT_MAX_WIDTH) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }

        // Se uma palavra sozinha for maior que o limite,
        // quebra a própria palavra para nunca ultrapassar
        // a área da mensagem.
        if (estimateTextWidth(word) > TEXT_MAX_WIDTH) {
          let partial = "";

          for (const char of word) {
            const testPartial = partial + char;

            if (
              estimateTextWidth(testPartial) <= TEXT_MAX_WIDTH
            ) {
              partial = testPartial;
            } else {
              if (partial) {
                lines.push(partial);
              }

              partial = char;
            }
          }

          currentLine = partial;
        } else {
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

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
  // TEXTO DA MENSAGEM
  // =========================

  const messageLines = wrapText(text);

  const messageSVG = messageLines
    .map((line, index) => {
      const y = TEXT_Y + (index * LINE_HEIGHT);

      return `
        <text
          x="${TEXT_X}"
          y="${y}"
          fill="white"
          font-family="Arial, sans-serif"
          font-size="${TEXT_SIZE}px"
          font-weight="400"
        >${escapeXML(line)}</text>
      `;
    })
    .join("");

  // =========================
  // NOME E USERNAME
  // =========================

  const escapedDisplayName = escapeXML(displayName);
  const escapedUsername = escapeXML(username);

  // =========================
  // SVG
  // =========================

  const svg = `
  <svg
    width="${WIDTH}"
    height="${HEIGHT}"
    xmlns="http://www.w3.org/2000/svg"
  >

    <!-- ========================= -->
    <!-- SOMBRA SOBRE O AVATAR -->
    <!-- ========================= -->

    <defs>
      <linearGradient
        id="avatarShadow"
        x1="${SHADOW_START}"
        y1="0"
        x2="${SHADOW_END}"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <!-- Começo praticamente transparente -->
        <stop
          offset="0%"
          stop-color="black"
          stop-opacity="0"
        />

        <!-- Começa a escurecer -->
        <stop
          offset="55%"
          stop-color="black"
          stop-opacity="0.35"
        />

        <!-- Forte perto do final -->
        <stop
          offset="82%"
          stop-color="black"
          stop-opacity="0.75"
        />

        <!-- Final totalmente preto -->
        <stop
          offset="100%"
          stop-color="black"
          stop-opacity="1"
        />
      </linearGradient>
    </defs>

    <rect
      x="${SHADOW_START}"
      y="0"
      width="${SHADOW_END - SHADOW_START}"
      height="${HEIGHT}"
      fill="url(#avatarShadow)"
    />

    <!-- ========================= -->
    <!-- MENSAGEM -->
    <!-- ========================= -->

    ${messageSVG}

    <!-- ========================= -->
    <!-- NOME -->
    <!-- ========================= -->

    <text
      x="${AUTHOR_X}"
      y="${DISPLAY_NAME_Y}"
      fill="white"
      font-family="Arial, sans-serif"
      font-size="${DISPLAY_NAME_SIZE}px"
      font-weight="400"
    >
      — ${escapedDisplayName}
    </text>

    <!-- ========================= -->
    <!-- USERNAME -->
    <!-- ========================= -->

    <text
      x="${AUTHOR_X}"
      y="${USERNAME_Y}"
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
