const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const AFK_FILE = path.join(__dirname, "../../afk.json");

function loadAFK() {
if (!fs.existsSync(AFK_FILE)) {
fs.writeFileSync(AFK_FILE, JSON.stringify({}, null, 2));
}

try {
return JSON.parse(fs.readFileSync(AFK_FILE, "utf8"));
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

module.exports = {
name: "afk",

async execute(message, args) {

const afkData = loadAFK();

const reason =
  args.join(" ").trim() ||
  " > Sem motivo informado";

afkData[message.author.id] = {
  reason,
  since: Date.now()
};

saveAFK(afkData);

const embed = new EmbedBuilder()
  .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
  .setTitle("💤 AFK Ativado")
  .setDescription(
    `Você agora está AFK.\n\n📝 Motivo: **${reason}**`
  )
  .setThumbnail(
    message.author.displayAvatarURL({
      dynamic: true
    })
  )
  .setTimestamp();

return message.reply({
  embeds: [embed]
});

}
};