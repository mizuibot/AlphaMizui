const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const MARRIAGES_FILE = path.join(
process.cwd(),
"marriages.json"
);

const LOVE_FILE = path.join(
process.cwd(),
"marriageLove.json"
);

function loadMarriages() {
if (!fs.existsSync(MARRIAGES_FILE))
return {};

return JSON.parse(
fs.readFileSync(
MARRIAGES_FILE,
"utf8"
)
);
}

function saveMarriages(data) {
fs.writeFileSync(
MARRIAGES_FILE,
JSON.stringify(data, null, 2)
);
}

function loadLove() {

if (!fs.existsSync(LOVE_FILE)) {

fs.writeFileSync(
  LOVE_FILE,
  JSON.stringify({}, null, 2)
);

}

try {

return JSON.parse(
  fs.readFileSync(
    LOVE_FILE,
    "utf8"
  )
);

} catch {

return {};

}
}

function saveLove(data) {

fs.writeFileSync(
LOVE_FILE,
JSON.stringify(data, null, 2)
);
}

function getPairId(userA, userB) {

return [userA, userB]
.sort()
.join("_");
}

module.exports = {

data: new SlashCommandBuilder()

.setName("mizuimarry")
.setDescription("Casar com alguém")

.addUserOption(o =>
  o
    .setName("user")
    .setDescription("Usuário")
    .setRequired(true)
),

async execute(interaction) {

const userId =
  interaction.user.id;

const target =
  interaction.options.getUser(
    "user"
  );

if (
  target.id === userId
) {
  return interaction.reply({
    content:
      "❌ Você não pode casar consigo mesmo.",
    ephemeral: true
  });
}

if (target.bot) {

  return interaction.reply({
    content:
      "❌ Você não pode casar com bots.",
    ephemeral: true
  });
}

const marriages =
  loadMarriages();

if (!marriages[userId])
  marriages[userId] = [];

if (!marriages[target.id])
  marriages[target.id] = [];

if (
  !marriages[userId].includes(
    target.id
  )
) {
  marriages[userId].push(
    target.id
  );
}

if (
  !marriages[target.id].includes(
    userId
  )
) {
  marriages[target.id].push(
    userId
  );
}

saveMarriages(
  marriages
);

// =====================
// LOVE SYSTEM
// =====================

const loveData =
  loadLove();

const pair =
  getPairId(
    userId,
    target.id
  );

if (!loveData[pair]) {

  loveData[pair] = {

    love: 100,

    marriedSince:
      Date.now(),

    handshake: 0,
    patpat: 0,
    hug: 0,
    kiss: 0,

    lastInteraction:
      Date.now()
  };

  saveLove(
    loveData
  );
}

const embed =
  new EmbedBuilder()

    .setColor(
      global.getEmbedColor(
        interaction.guild.id
      )
    )

    .setTitle(
      "💍 Casamento"
    )

    .setDescription(
      `${interaction.user} casou com ${target} 💕`
    )

    .addFields({
      name:
        "❤️ LovePoints",
      value:
        "100/100",
      inline: true
    })

    .setTimestamp();

return interaction.reply({
  embeds: [embed]
});

}
};