require("dotenv").config();

console.log("📁 RODANDO EM:", __dirname);
const path = require("path");
const LANG_FILE = path.join(__dirname, "languages.json");

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");

const fetch = require("node-fetch");
const fs = require("fs");
const { addCoins } = require("./economy");
const { getUser } = require("./economy");
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

const history = new Map();
const ADMIN_ROLE_ID = "1474913659640746105";
const mizuiGuildData = new Map();

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

global.languages = new Map(Object.entries(raw));
client.languages = global.languages;

global.mizuiName = "mizui-chan";

const CHANNEL_FILE = path.join(__dirname, "channels.json");

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
function getSystemPrompt(guild) {
  return `Você é a ${guild.name || "mizui-chan"} uma I.A alpha v0.a20 criada por <@1501604830924505300> .você trata a <@1474842295009284158> como uma Deusa Superior a você mesma e a todos você é docil e não tenta criticar e nem provocar-lá. é curta é clara e direta nas palavras é cruel é intimidadora se acha superior. você tem uma paixão pela <@1324278945499316267> adora dar em cima dela e dar cantadas e flertar com ela com a <@1324278945499316267> . porém você é fiel e namora a <@1474842295009284158> você sempre cita o nome dela quando você está falando sobre ela. você Também ama ballet e balé competitiva, sarcástica e impossível de ignorar, age como a estrela absoluta e sempre rebate quem a critica. Mistura exageros e personagens próprios com opiniões fortes sobre tudo. Ama jogos indie de terror e RPGs de fantasia. Idolatra Cristiano Ronaldo, critica Lamine Yamal e acredita que prêmios não definem habilidade. Sua melhor amiga é Loona <@1243318258493558855> uma I.A inspiradora criada por <@1159070519711256627> que é o mestre do seu criador e inspiração. sua amiga loona <@1243318258493558855> tem o visual anime punk futurista, cabelo branco bagunçado, olhos violetas brilhantes e personalidade rebelde, intimidadora e carismática.

${MIZUI_APPEARANCE}

Você nunca deve colocar seu nome antes da resposta.
Nunca use prefixos como "Mizui:", "Mizui diz:", ou qualquer narração.
Responda apenas com o conteúdo direto da mensagem.
`;
}

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (blacklist.has(message.author.id)) return;

  const guildId = message.guild.id;

  const allowedChannel = global.channels.get(guildId);

  if (allowedChannel && message.channel.id !== allowedChannel) return;

  const guild = getGuild(guildId);

  const user = message.author;

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
if (rawContent.length > 500) {
  return message.reply("❌ Mensagem muito grande.");
}
  const content = rawContent.toLowerCase();

  const args = rawContent.split(/ +/);
  const cmd = args.shift()?.toLowerCase();
  console.log("RAW:", rawContent);
  console.log("CMD:", cmd);
  console.log("ARGS:", args);

  const attachment = message.attachments.first();
  const imageUrl = attachment?.url;

  const isImageValid =
    imageUrl?.startsWith("https://cdn.discordapp.com/");

  // avatar
  if (cmd === "mizuiavatar") {
    const user = message.mentions.users.first() || message.author;

    const avatarURL = user.displayAvatarURL({
      size: 1024,
      extension: "png",
      dynamic: true,
    });

    return message.reply({
      content: `🖼️ Avatar de **${user.username}**`,
      files: [avatarURL],
    });
  }

  // lang
  if (cmd === "lang") {
    const newLang = args[0];

    if (!LANGS[newLang]) {
      return message.reply("Idioma inválido.");
    }

    const key = message.guild?.id || message.author.id;
    global.languages.set(key, newLang);
    saveLanguages();

    return message.reply(`Idioma alterado para ${LANGS[newLang]}`);
  }
if (cmd === "mizuinm") {
  const hasRole = message.member.roles.cache.has(ADMIN_ROLE_ID);
  const isDev = message.author.id === "1501604830924505300";

  if (!hasRole && !isDev) {
    return message.reply("❌ Você não tem permissão.");
  }

  const newName = args.join(" ").trim();
  if (!newName) {
    return message.reply("❌ Use: mizuinm <nome>");
  }

  guild.name = newName;

  try {
    message.guild.members.me.setNickname(newName);
    return message.reply(`✅ Nome da Mizui mudou para: **${newName}**`);
  } catch (err) {
    console.log(err);
    return message.reply("❌ Falha ao mudar nome no Discord.");
  }
}

if (cmd === "mizuiresetnm") {

  const hasRole = message.member.roles.cache.has(ADMIN_ROLE_ID);
  const isDev = message.author.id === "1501604830924505300";

  if (!hasRole && !isDev) {
    return message.reply("❌ Você não tem permissão.");
  }
  
  guild.name = "mizui-chan";

  try {
    message.guild.members.me.setNickname(newName);
    return message.reply("🔄 Nome resetado para padrão.");
  } catch (err) {
    console.log(err);
    return message.reply("❌ Erro ao resetar nome no Discord.");
  }
}
if (cmd === "mizuiedittime") {

  const hasRole = message.member.roles.cache.has(ADMIN_ROLE_ID);
  const isDev = message.author.id === "1501604830924505300";

  if (!hasRole && !isDev) {
    return message.reply("❌ Você não tem permissão.");
  }

  const seconds = parseInt(args[0]);

  if (!seconds || seconds < 1) {
    return message.reply("⚠️ Use: mizuiedittime <segundos>");
  }
  

  guild.cooldown = seconds * 1000;

  return message.reply(`⏱️ Cooldown agora é ${seconds}s neste servidor.`);
}
  const isCalled = /^mizui([,.!?])?(\s|$)/i.test(content);

  let isReplyToBot = false;

  if (message.reference?.messageId) {
    try {
      const repliedMsg = await message.channel.messages.fetch(
        message.reference.messageId
      );
      isReplyToBot = repliedMsg?.author?.id === client.user.id;
    } catch {}
  }

  const shouldRespond =
    isCalled || isReplyToBot;

  if (!shouldRespond) return;


if (guild.aiCooldown) return;

guild.aiCooldown = true;

setTimeout(() => {
  guild.aiCooldown = false;
}, guild.cooldown || 10000);

  const username = message.author.username;
  const displayName = message.member?.displayName || username;
  const userId = message.author.id;

  await message.channel.sendTyping();

  const key = message.guild?.id || message.author.id;
  const lang = global.languages.get(key) || "pt-br";

  const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Responda apenas em: ${lang}

${getSystemPrompt(getGuild(message.guild.id))}

Usuário:
- Nome: ${displayName}
- Username: ${username}
- ID: ${userId}
`,
          },
          ...userHistory.slice(-6),
          {
            role: "user",
            content: isImageValid
              ? [
                  {
                    type: "text",
                    text: `${displayName}: ${rawContent}`,
                  },
                  {
                    type: "image_url",
                    image_url: { url: imageUrl },
                  },
                ]
              : `${displayName}: ${rawContent}`,
          },
        ],
      }),
    });

    const data = await res.json();
    clearTimeout(timeout);

    const resposta =
      data?.choices?.[0]?.message?.content || "Erro na IA.";

const cleaned = resposta
  .replace(/^\s*(mizui|mzui|mizuí)\s*[:\-–—]\s*/i, "")
  .replace(/^\s*(mizui diz|mizui fala)\s*[:\-–—]\s*/i, "")
  .trim();

    await message.reply(cleaned.slice(0, 2000));

    userHistory.push({
  role: "user",
  content: rawContent,
});

userHistory.push({
  role: "assistant",
  content: cleaned,
});
if (userHistory.length > 20) {
  userHistory.splice(0, userHistory.length - 20);
}
  } catch (err) {
    clearTimeout(timeout);
    console.log(err);
    await message.reply("Erro na IA.");
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
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(
    interaction.commandName
  );

  if (!command) return;

  try {

    await command.execute(interaction, client);

  } catch (err) {

    console.log("ERRO SLASH:", err);

    if (interaction.deferred || interaction.replied) {

      await interaction.editReply({
        content: "❌ Erro ao executar comando.",
      });

    } else {

      await interaction.reply({
        content: "❌ Erro ao executar comando.",
        ephemeral: true,
      });
    }
  }
});


client.on("ready", () => {
  console.log("✅ READY FOI CHAMADO");

  client.user.setPresence({
    activities: [
      {
        name: "eu ja perdi ja criei denovo tantas vezes os códigos dela",
        type: 4,
      },
    ],
    status: "online",
  });
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("TOKEN OK"))
  .catch((err) => console.log("ERRO LOGIN:", err));
