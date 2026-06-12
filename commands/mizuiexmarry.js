const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const MARRIAGES_FILE = path.join(process.cwd(), "marriages.json");

function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE)) return {};
  return JSON.parse(fs.readFileSync(MARRIAGES_FILE, "utf8"));
}

function saveMarriages(data) {
  fs.writeFileSync(MARRIAGES_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiexmarry")
    .setDescription("Divorciar"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const marriages = loadMarriages();

    const partners = marriages[userId] || [];

    if (partners.length === 0) {
      return interaction.reply({
        content: "💔 Você não está casado com ninguém.",
        ephemeral: true
      });
    }

    for (const partnerId of partners) {
      marriages[partnerId] = (marriages[partnerId] || [])
        .filter(id => id !== userId);
    }

    delete marriages[userId];

    saveMarriages(marriages);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("💔 Divórcio")
          .setDescription("Você se divorciou de todos 💔")
          .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)
      ]
    });
  }
};