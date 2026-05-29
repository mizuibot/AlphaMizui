const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

const jobs = [
  "você trabalhou como entregador 🚚",
  "você programou um bot 💻",
  "você vendeu skins 🎮",
  "você ajudou um servidor 🛠️",
  "você fez freelas na internet 🌐"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Trabalhar e ganhar mzcoins"),

  async execute(interaction) {

    const reward =
      Math.floor(Math.random() * 200) + 50;

    const job =
      jobs[Math.floor(Math.random() * jobs.length)];

    guildEco.addCoins(
      interaction.guild.id,
      interaction.user.id,
      reward,
      interaction.user.username,
      interaction.user.displayAvatarURL({
        dynamic: true,
        size: 128
      })
    );

    return interaction.reply({
      content:
        `💼 ${job} e ganhou **${reward} mzcoins**`
    });
  }
};