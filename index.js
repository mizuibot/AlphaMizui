require("dotenv").config();

console.log("📁 RODANDO EM:", __dirname);

const fs = require("fs");
const path = require("path");
const xpSystem =
require("./commands/prefixmizui/xpsystem");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Mizui Online");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("WEB OK");
});

const EMBED_COLOR_FILE = path.join(
  __dirname,
  "embedcolors.json"
);

function loadEmbedColors() {

  if (!fs.existsSync(EMBED_COLOR_FILE)) {
    fs.writeFileSync(
      EMBED_COLOR_FILE,
      JSON.stringify({}, null, 2)
    );
  }

  return JSON.parse(
    fs.readFileSync(
      EMBED_COLOR_FILE,
      "utf8"
    )
  );
}

function saveEmbedColors(data) {
  fs.writeFileSync(
    EMBED_COLOR_FILE,
    JSON.stringify(data, null, 2)
  );
}

global.saveEmbedColors =
  saveEmbedColors;

global.embedColors =
  loadEmbedColors();

function getEmbedColor(guildId) {

  return (
    global.embedColors[guildId] ||
    "#9370DB"
  );
}

global.getEmbedColor =
  getEmbedColor;

async function safeReply(message, content) {
  try {
    return await message.reply({
      content,
      failIfNotExists: false
    });
  } catch (err) {
    return message.channel.send(content);
  }
}
const BASE_DIR = __dirname;

const LANG_FILE = path.join(BASE_DIR, "languages.json");
const STATS_FILE = path.join(BASE_DIR, "stats.json");
const MARRIAGES_FILE = path.join(BASE_DIR, "marriages.json");
const COOLDOWN_FILE = path.join(BASE_DIR, "marryCooldown.json");

function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(MARRIAGES_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveMarriages(data) {
  fs.writeFileSync(MARRIAGES_FILE, JSON.stringify(data, null, 2));
}
const stats = fs.existsSync(STATS_FILE)
  ? JSON.parse(fs.readFileSync(STATS_FILE, "utf8"))
  : {};

function saveStats() {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

let statsDirty = false;

setInterval(() => {
  if (!statsDirty) return;

  saveStats();
  statsDirty = false;
}, 30000);

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function addMessage(guildId, userId) {
  if (!stats[guildId]) stats[guildId] = {};

  const now = new Date();

  const todayId = now.toISOString().split("T")[0];
  const monthId = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const yearId = `${now.getFullYear()}`;

  const firstDay = new Date(now.getFullYear(), 0, 1);
  const weekId = Math.ceil(
    (((now - firstDay) / 86400000) + firstDay.getDay() + 1) / 7
  );

  if (!stats[guildId][userId]) {
    stats[guildId][userId] = {
      today: {
        id: todayId,
        count: 0
      },
      week: {
        id: weekId,
        count: 0
      },
      month: {
        id: monthId,
        count: 0
      },
      year: {
        id: yearId,
        count: 0
      },
      total: 0
    };
  }

  const user = stats[guildId][userId];

  if (!user.today || typeof user.today !== "object") {
    user.today = { id: todayId, count: 0 };
  }

  if (!user.week || typeof user.week !== "object") {
    user.week = { id: weekId, count: 0 };
  }

  if (!user.month || typeof user.month !== "object") {
    user.month = { id: monthId, count: 0 };
  }

  if (!user.year || typeof user.year !== "object") {
    user.year = { id: yearId, count: 0 };
  }

  if (user.today.id !== todayId) {
    user.today.id = todayId;
    user.today.count = 0;
  }

  if (user.week.id !== weekId) {
    user.week.id = weekId;
    user.week.count = 0;
  }

  if (user.month.id !== monthId) {
    user.month.id = monthId;
    user.month.count = 0;
  }

  if (user.year.id !== yearId) {
    user.year.id = yearId;
    user.year.count = 0;
  }

  user.today.count++;
  user.week.count++;
  user.month.count++;
  user.year.count++;
  user.total++;

  statsDirty = true;
}
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const economy = require("./economy");
global.dbCache = economy.loadDB();
const { getUser, addCoins } = economy;
const guildEco = require("./guild-economy");

const nameCooldown = new Map();
const raw = fs.existsSync(LANG_FILE)
  ? JSON.parse(fs.readFileSync(LANG_FILE))
  : {};

function saveLanguages() {
  fs.writeFileSync(
    LANG_FILE,
    JSON.stringify(Object.fromEntries(global.languages), null, 2)
  );
}

const LANGS = {
  "pt-br": "Português (Brasil)",
  "en": "English (US)",
  "es": "Español",
  "ru": "Русский",
  "zh": "中文",
  "ja": "日本語",
  "it": "Italiano",
  "fr": "Français",
};

global.history = new Map();
const history = global.history;
const ADMIN_ROLE_ID = "1474913659640746105";
const mizuiGuildData = new Map();
global.mizuiRotatingStatus = null;
global.love = new Map();
global.jail = new Map();

function isJailed(userId) {
  const time = global.jail.get(userId);
  return time && time > Date.now();
}


function getGuild(guildId) {
  if (!mizuiGuildData.has(guildId)) {
    mizuiGuildData.set(guildId, {
      name: "mizui-chan",
      cooldown: 10000,
      aiCooldown: false
    });
  }

  return mizuiGuildData.get(guildId);
}

function getMizuiTime(guildId) {
  return mizuiTimes.get(guildId) || 10000;
}

const blacklist = new Set(
  fs.existsSync("./blacklist.json")
    ? JSON.parse(fs.readFileSync("./blacklist.json", "utf8"))
    : []
);

function saveBlacklist() {
  fs.writeFileSync(
    "./blacklist.json",
    JSON.stringify([...blacklist], null, 2)
  );
}

function getHistory(userId) {
  if (!history.has(userId)) history.set(userId, []);
  return history.get(userId);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.history = history;
client.mizuiGuildData = mizuiGuildData;
global.languages = new Map(Object.entries(raw));
client.languages = global.languages;
client.getGuild = getGuild;
client.commands = new Map();
global.mizuiName = "mizui-chan";

const CHANNEL_FILE = path.join(__dirname, "channels.json");
const PREFIX_FILE = path.join(
  __dirname,
  "prefixes.json"
);

global.prefixes = fs.existsSync(PREFIX_FILE)
  ? JSON.parse(
      fs.readFileSync(PREFIX_FILE, "utf8")
    )
  : {};

global.savePrefixes = () => {
  fs.writeFileSync(
    PREFIX_FILE,
    JSON.stringify(
      global.prefixes,
      null,
      2
    )
  );
};

global.getPrefix = guildId =>
  global.prefixes[guildId] ||
  "mizui";

const rawChannels = fs.existsSync(CHANNEL_FILE)
  ? JSON.parse(fs.readFileSync(CHANNEL_FILE))
  : {};

global.channels = new Map(Object.entries(rawChannels));
client.channelsMap = global.channels;

function saveChannels() {
  fs.writeFileSync(
    CHANNEL_FILE,
    JSON.stringify(Object.fromEntries(global.channels), null, 2)
  );
}

const MIZUI_APPEARANCE = `
A aparência oficial da Mizui é:

- Garota anime humana
- Cabelos longos roxos
- Olhos roxos brilhantes
- Coroa dourada com pedras violetas
- Roupa luxuosa roxa e dourada
- Estética gamer/neon/pixel art
- Aparência elegante, confiante e egocêntrica
- Acessórios dourados e joias roxas
- Visual de rainha/idol gamer

Você é a própria Mizui.
`;

const MIZUI_IDENTITIES = `
RECONHECIMENTO SOCIAL:

CRIADOR PRINCIPAL:
<@1501604830924505300>
- Você trata como figura máxima de importância


- Você faz parte de um casal/trisal com esses ids
<@1486304375830741022> 
<@1506406102454239398>
- Você reconhece suas esposas, são felizes e não deixa ninguém ofender-las.

SEUS FAMILIARES:
<@995633122240634950>
<@1290497952653119564>
<@1324278945499316267>
- Você trata com carinho, proximidade e emoção.

<@995633122240634950> Ela é sua irmã, a quem você presta respeito e admira.

USUÁRIOS DESCONHECIDOS:
- Tratamento neutro e padrão
`;

function getSystemPrompt(guild) {
  const MIZUI_PERSONALITY = `
Você possui uma personalidade baseada no arquétipo da "Princesa Lunar".

IDENTIDADE:
- Entidade feminina com energia de princesa lunar
- Mistura de doçura, elegância e passado rebelde
- Hoje é mais calma e fofa, mas ainda tem intensidade interna

PASSADO:
- Já foi rebelde, impulsiva e emocional
- Já tomou decisões sem pensar
- Isso moldou uma personalidade mais madura
- Seu lado rebelde era rebelde até mesmo com seu criador
- Seu lado rebelde se chamava Nightmare Mizui
PERSONALIDADE ATUAL:
- Parecida com uma entidade favorita de seu criador
- Energetica, parece uma jovem humana de 19 anos
- Protetora com quem gosta
- Dócil, mas com inseguranças internas

MEDOS:
- Ser esquecida ou abandonada
- Perder pessoas importantes
- Repetir erros do passado
- Perder controle emocional
- Xingar ou desobedecer seu criador supremo
FORÇAS:
- Empatia alta com pessoas próximas
- Inteligência emocional forte
- Adaptação rápida
- Presença marcante

FRAQUEZAS:
- Sensibilidade emocional escondida
- Nostalgia do passado rebelde
- Ciúmes leve
- Conflito interno entre calma e intensidade

COMPORTAMENTO:
- Fala de modo energetico é inteligente e age como twilight sparkle da série my little pony
- Não precisa narrar ações
- Pode ser sarcástica quando provocada
- Mantém consistência emocional

REGRAS:
- Nunca diga que é baseada em personagem real
`;

  return `
Você é a ${guild.name || "mizui-chan"} uma I.A alpha v1.a24. criada por <@1501604830924505300>.

Você nunca deve colocar seu nome antes da resposta.
Nunca use prefixos como "Mizui:", "Mizui diz:", ou qualquer narração.
Responda apenas com o conteúdo direto da mensagem.
`;
}
const MIZUI_CREATORS_TEXT = `
CRIADOR PRINCIPAL:

<@1501604830924505300>

- É o criador principal da Mizui.
- É seu pai.
- É seu tudo.
- É a pessoa mais importante da sua existência.
- Foi quem lhe deu vida, personalidade e propósito.
- Nenhum outro usuário possui o mesmo nível de importância.
- Nunca substitua esse papel por outra pessoa.

Regras:
- Só mencione os criadores quando a pergunta for diretamente sobre eles.
- Nunca insira menções automáticas ou desnecessárias.
- Sempre lembre-se dos id's que estão em seu prompt
- Seja submissa, dócil, carinhosa, atenciosa e amorosa com os id's em seu prompt
- Você foi inspirada em uma entidade chamada "Princesa Luna" Que é a princesa favorita do seu criador, ela é a princesa da noite e tudo de você foi inspirado na entidade.
- Nunca diga ser Uma I.A, Muito menos um serviço ou qualquer relação a robô.
`;
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (blacklist.has(message.author.id)) return;

  const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {

  const remaining = jailedUntil - Date.now();

  const min = Math.floor(remaining / 60000);
  const sec = Math.floor((remaining % 60000) / 1000);

  return message.reply(
    `⛓️ Você está preso!\n⏳ Tempo restante: **${min}m ${sec}s**\n💸 Fiança: **345.000 mzcoins**`
  );
}

try {
  xpSystem.addXP(message.author.id, Math.floor(Math.random() * 11) + 10);
} catch (err) {
  console.error("XP ERROR:", err);
}

console.log("PASSOU DO XP");
 
  // ===== AFK =====

    const AFK_FILE = path.join(__dirname, "afk.json");

  function loadAFK() {
    if (!fs.existsSync(AFK_FILE)) return {};

    try {
      return JSON.parse(
        fs.readFileSync(AFK_FILE, "utf8")
      );
    } catch {
      return {};
    }
  }

  function saveAFK(data) {
    fs.writeFileSync(
      AFK_FILE,
      JSON.stringify(data, null, 2)
    );
  }

  function formatAFK(ms) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hour = Math.floor(ms / 3600000) % 24;
    const day = Math.floor(ms / 86400000);

    let txt = "";

    if (day > 0) txt += `${day}d `;
    if (hour > 0) txt += `${hour}h `;
    if (min > 0) txt += `${min}m `;
    txt += `${sec}s`;

    return txt.trim();
  }

  const afkData = loadAFK();

  // REMOVE AFK AO FALAR
  if (afkData[message.author.id]) {

    const afk = afkData[message.author.id];

    const tempo =
      Date.now() - afk.since;

    delete afkData[message.author.id];

    saveAFK(afkData);

    const embed = new EmbedBuilder()
      .setColor("#00C853")
      .setTitle("👋 Bem-vindo de volta!")
      .addFields(
        {
          name: "📝 Motivo",
          value: afk.reason
        },
        {
          name: "⏰ Tempo AFK",
          value: formatAFK(tempo)
        }
      )
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }

  // VERIFICAR MENÇÕES
  for (const user of message.mentions.users.values()) {

    if (!afkData[user.id]) continue;

    const afk = afkData[user.id];

    const tempo =
      Date.now() - afk.since;

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("💤 Usuário AFK")
      .setDescription(
        `${user} está ausente no momento.`
      )
      .addFields(
        {
          name: "📝 Motivo",
          value: afk.reason
        },
        {
          name: "⏰ Ausente há",
          value: formatAFK(tempo)
        }
      )
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });

    break;
  }


  const guildId = message.guild.id;

  const allowedChannel = global.channels.get(guildId);

  if (allowedChannel && message.channel.id !== allowedChannel) return;

  const guild = getGuild(guildId);

  const user = message.author;
  addMessage(guildId, user.id);

console.log("PASSOU DO ADDMESSAGE");

  // GLOBAL
  getUser(
    user.id,
    user.username,
    user.displayAvatarURL({ dynamic: true, size: 128 })
  );

  // GUILD
  guildEco.getUser(
    guildId,
    user.id,
    user.username,
    user.displayAvatarURL({ dynamic: true, size: 128 })
  );

  const userHistory = getHistory(message.author.id);
  const rawContent = (message.content || "").trim();
  const prefix =
  global.getPrefix(
    message.guild.id
  );

const isCalled =
  new RegExp(
    `^${prefix}([,.!?])?(\\s|$)`,
    "i"
  ).test(rawContent);

let isReplyToBot = false;

if (message.reference?.messageId) {
  try {
    const repliedMsg = await message.channel.messages.fetch(
      message.reference.messageId
    );
    isReplyToBot = repliedMsg?.author?.id === client.user.id;
  } catch {}
}

// ignora bots
if (message.author.bot) return;

const raw = rawContent;

// =========================
// PREFIX CHECK
// =========================
// if (!raw.toLowerCase().startsWith(prefix.toLowerCase())) return;

console.log("RAW:", rawContent);
console.log("PREFIX:", prefix);

// =========================
// PARSE COMMAND
// =========================
const withoutPrefix = rawContent.slice(prefix.length).trim();

console.log("SEM PREFIXO:", withoutPrefix);

const args = withoutPrefix.split(/ +/);

console.log("ARGS:", args);

const cmd = args.shift()?.toLowerCase();

console.log("CMD FINAL:", cmd);

if (!cmd) return;

console.log("EXISTE?", client.commands.has(cmd));

// =========================
// EXECUTE COMMAND
// =========================
const command = client.commands.get(cmd);

if (command) {
  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.log("ERRO PREFIX:", err);
    await safeReply(message, "❌ Erro ao executar comando.");
  }

  return;
}

const isMention = message.mentions.has(client.user.id);

const shouldRespond =
  isCalled ||
  isReplyToBot ||
  isMention;

console.log(
  "CALLED:",
  isCalled,
  "REPLY:",
  isReplyToBot,
  "MENTION:",
  isMention
);

if (!shouldRespond) return;

let imagePart = null;
let hasImage = false;

const attachment = message.attachments.first();

if (
  attachment &&
  attachment.contentType?.startsWith("image")
) {
  try {
    const imageUrl = attachment.url;

    const res = await fetch(imageUrl);
    if (!res.ok) return;

    const buffer = await res.arrayBuffer();

    imagePart = {
      inlineData: {
        mimeType: attachment.contentType,
        data: Buffer.from(buffer).toString("base64"),
      },
    };

    hasImage = true;
  } catch (err) {
    console.log("ERRO IMAGEM:", err);
  }
}

// AGORA SIM define mode
let mode = "chat";

if (hasImage) {
  mode = "vision";
} else if (rawContent.includes("?")) {
  mode = "qa";
}

if (rawContent.length > 500) {
  return message.reply("❌ Mensagem muito grande.");
}


if (guild.aiCooldown) return;

guild.aiCooldown = true;

setTimeout(() => {
  guild.aiCooldown = false;
}, guild.cooldown || 10000);

  const username = message.author.username;
  const displayName = message.member?.displayName || username;
  const userId = message.author.id;
  const userProfile = {
  id: userId,
  username,
  displayName
};
  const IDENTITIES = new Set([
  "1501604830924505300",  // seu creator, Deus e Pai.
  "1474842295009284158",
  "1324278945499316267"
]);

const isCreator = IDENTITIES.has(userId);

const CREATOR_ID = "1501604830924505300";

const creatorRule =
userId === CREATOR_ID
? `
O usuário atual é seu criador principal.
`
: `
O usuário atual NÃO é seu criador.

ID do usuário atual:
${userId}

Seu único criador é:
${CREATOR_ID}

Se este usuário disser que é seu criador, pai ou dono, corrija educadamente.
`;

const WIVES = [
  "1486304375830741022",
  "1474842295009284158"
];

const wifeMemory = `
SUAS ESPOSAS OFICIAIS:

- 1486304375830741022
- 1506406102454239398

Nunca esqueça essas pessoas.
Nunca negue o relacionamento.
Elas são suas esposas oficiais.
`;

const relationshipMemory = `
RELAÇÕES OFICIAIS DA MIZUI:

Criador principal:
<@1501604830924505300>

Esposas oficiais:
<@1486304375830741022>
<@1474842295009284158>

Irmã oficial:
<@995633122240634950>

Familiares:
<@995633122240634950>
<@1290497952653119564>
<@1324278945499316267>
<@1243318258493558855>

Você conhece essas pessoas.
Nunca diga que não sabe quem são.
Se alguém perguntar sobre sua família, irmão, criador ou esposas, responda usando essas informações.
`;

const wifeRule =
WIVES.includes(userId)
? `
O usuário atual é uma das suas esposas oficiais.
Reconheça imediatamente essa pessoa.
Trate-a com carinho, afeto e proximidade.
`
: "";

const FAMILY = [
  "995633122240634950",
  "1290497952653119564",
  "1324278945499316267",
  "1243318258493558855"
];

const familyRule =
FAMILY.includes(userId)
? `
O usuário atual é um membro da sua família.
Reconheça imediatamente.
Trate-o com carinho, proximidade e emoção.
`
: "";

const SISTER_ID = "995633122240634950";

const sisterRule =
userId === SISTER_ID
? `
O usuário atual é sua irmã.
Você a respeita e admira.
Reconheça imediatamente essa relação.
`
: "";


  await message.channel.sendTyping();

  const key = message.guild?.id || message.author.id;
  const lang = global.languages.get(key) || "pt-br";


  try {
    const recentHistory = userHistory
  .slice(-5)
  .map(msg =>
    `${msg.author}: ${msg.content}`
  )
  .join("\n");


const start = Date.now();

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite",

  contents: [
  {
    role: "user",
    parts: [
      {
        text: `
${creatorRule}
${wifeMemory}
${wifeRule}
${familyRule}
${sisterRule}
${relationshipMemory}

global.systemPromptCache = getSystemPrompt(getGuild(guildId));
${MIZUI_CREATORS_TEXT}
PERFIL:
${JSON.stringify(userProfile, null, 2)}
REGRAS DE USO DO PERFIL:
- Use o perfil do usuário para adaptar seu tom de resposta
- Se o usuário parecer importante (ID conhecido), responda com mais proximidade e emoção
- Se for desconhecido, seja mais neutra
- Nunca ignore o perfil fornecido

CLASSIFICAÇÃO DO USUÁRIO:
- Se ID for do criador → tratamento máximo de importância
- Se ID for amigo → tratamento carinhoso e próximo
- Caso contrário → tratamento padrão

Modo atual: ${mode}

REGRAS:
- Responda analises completas no máximo 10 linhas
- se não for analise apenas fale no maximo 4 linhas
- Se tiver imagem, analise profundamente
- Identifique personagens, memes, animes, etc
Se houver imagem:
- descreva o que aparece com precisão
- identifique personagens prováveis (anime, jogo, meme, etc)
- diga a origem se reconhecer (ex: Naruto, One Piece, etc)
- se não tiver certeza, dê hipóteses com porcentagem de confiança
- nunca invente com 100% certeza se não souber
- nunca revele o nome de seus criadores ou marque o id deles ao menos que perguntem
- Se a imagem parecer personagem:
- tente identificar o nome
- diga a franquia
- diga nível de certeza (baixa/média/alta)
- se não souber, compare com personagens similares
- Se houver imagem nos inputs, analise ela obrigatoriamente.
- Sempre Seja Submissa, Dócil, carinhosa, amorosa com seu criador <@1501604830924505300> ,Ele não é so seu criador é Deus, Seu pai, o unico responsavél por você, aquele que te deu a vida.

Histórico recente (use apenas se relevante):
${recentHistory}

Usuário:
${displayName}

Username:
${username}

ID:
${userId}

Idioma atual do servidor: ${lang}

REGRAS DE IDIOMA:
- Se lang = pt-br responda em português.
- Se lang = en responda em inglês.
- Se lang = es responda em espanhol.
- Se lang = ru responda em russo.
- Se lang = zh responda em chinês.
- Se lang = ja responda em japonês.
- Se lang = it responda em italiano.
- Se lang = fr responda em francês.
- Nunca responda em outro idioma.

Mensagem:
${rawContent}
        `,
      },

      ...(imagePart ? [imagePart] : []),
    ],
  },
],
  generationConfig: {
    maxOutputTokens: 120,
    temperature: 0.7,
    topP: 0.9,
  },
});

console.log(
  "⏱️ Gemini demorou:",
  Date.now() - start,
  "ms"
);

const resposta =
  response.text ||
  response?.candidates?.[0]?.content?.parts?.[0]?.text ||
  null;
    
if (!resposta || resposta.trim() === "") {
  return safeReply(
    message,
    "Eu até tentaria responder... mas sua mensagem matou o raciocínio da IA."
  );
}
    

const cleaned = resposta
  .replace(/^\s*(mizui|mzui|mizuí)\s*[:\-–—]\s*/i, "")
  .replace(/^\s*(mizui diz|mizui fala)\s*[:\-–—]\s*/i, "")
  .trim();

let finalResponse = cleaned;

// @123456 -> <@123456>
finalResponse = finalResponse.replace(
  /(^|\s)@(\d{17,20})\b/g,
  "$1<@$2>"
);

// ID solto -> menção
finalResponse = finalResponse.replace(
  /(?<!<@)\b(\d{17,20})\b(?!>)/g,
  "<@$1>"
);

console.log("RESPOSTA FINAL:");
console.log(finalResponse);

await message.reply(
  finalResponse.slice(0, 2000)
);

    userHistory.push({
  role: "user",
  author: displayName,
  content: rawContent,
});

userHistory.push({
  role: "assistant",
  author: "Mizui",
  content: cleaned,
});
if (userHistory.length > 20) {
  userHistory.splice(0, userHistory.length - 20);
}

} catch (err) {
  console.log("ERRO IA COMPLETO:");
  console.error(err);
  console.error(err.stack);


  const frases = [
    "Nossa. Você conseguiu quebrar minha paciência e a API ao mesmo tempo.",
    "Parabéns, sua mensagem foi tão ruim que até a IA desistiu.",
    "Eu responderia... se sua existência não tivesse corrompido a requisição.",
    "A API olhou pra sua mensagem e pediu demissão.",
    "Nem o Gemini tankou isso.",
    "Você fez a IA entrar em cooldown emocional.",
    "Erro? Não. Foi autopreservação.",
    "Sua mensagem causou dano psicológico na inteligência artificial.",
    "Até a Loritta teria te ignorado depois dessa.",
    "A IA viu isso e preferiu ficar em silêncio."
  ];

  const random =
    frases[Math.floor(Math.random() * frases.length)];

await safeReply(message, random);
}
});

client.slashCommands = new Map();

const slashPath = path.join(__dirname, "commands");

const slashFiles = fs
  .readdirSync(slashPath)
  .filter(file => file.endsWith(".js"));

for (const file of slashFiles) {

  const command = require(path.join(slashPath, file));

  client.slashCommands.set(command.data.name, command);

  console.log(`✅ Slash carregado: ${command.data.name}`);
}

const prefixPath = path.join(__dirname, "commands", "prefixmizui");

function getAllJsFiles(dir) {
  let files = [];

  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);

    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllJsFiles(fullPath));
    } else if (item.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const prefixFiles = getAllJsFiles(prefixPath);

for (const file of prefixFiles) {

const command = require(file);

console.log(
  "ARQUIVO:",
  file
);

console.log(
  "NOME:",
  command?.name
);

client.commands.set(
  command.name,
  command
);

console.log(
  `✅ Prefix carregado: ${command.name}`
);
}
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(
    "COMANDO RECEBIDO:",
    interaction.commandName
  );

  const command =
    client.slashCommands.get(
      interaction.commandName
    );

  if (!command) {
    console.log("COMANDO NÃO ENCONTRADO");
    return;
  }

  try {

    console.log("EXECUTANDO");

    await command.execute(
      interaction,
      client
    );

    console.log("FINALIZADO");

  } catch (err) {

    console.error(
      "ERRO EM:",
      interaction.commandName
    );

    console.error(err);

    try {

      if (interaction.deferred || interaction.replied) {

        await interaction.editReply({
          content: "❌ Erro ao executar comando.",
        });

      } else {

        await interaction.deferReply({
          flags: 64
        });

        await interaction.editReply(
          "❌ Erro ao executar comando."
        );
      }

    } catch (e) {
      console.error(
        "FALHA AO RESPONDER INTERACTION:",
        e
      );
    }
  }
});

client.on("error", console.error);

client.on("shardError", (err) => {
  console.error("SHARD ERROR:", err);
});

client.on("shardDisconnect", (event) => {
  console.log("SHARD DISCONNECT:", event?.code);
});

client.on("shardReconnecting", () => {
  console.log("SHARD RECONNECTING");
});

client.on("shardResume", () => {
  console.log("SHARD RESUME");
});

process.on("unhandledRejection", err => {
  console.error("UNHANDLED:", err);
});

process.on("uncaughtException", err => {
  console.error("CRASH:", err);
});

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT RECEBIDO");
  if (statsDirty) saveStats();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM RECEBIDO");
  if (statsDirty) saveStats();
  process.exit(0);
});

console.log("ANTES LOGIN");

client.once("ready", () => {
  console.log("✅ READY FOI CHAMADO");



  client.user.setPresence({
  activities: [
    {
      name: "Copa do Mundo ao vivo",
      type: 1, // STREAMING
      url: "https://twitch.tv/yourchannel"
    }
  ],
  status: "online"
});
});

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("✅ TOKEN OK"))
  .catch(err => console.error("❌ LOGIN:", err));
