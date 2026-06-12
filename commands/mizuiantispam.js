const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiantispam")
    .setDescription("Ativar anti-spam"),

  async execute(interaction) {

    global.antiSpam = global.antiSpam || new Set();
    global.antiSpam.add(interaction.guild.id);

    return interaction.reply("⚡ Anti-spam ativado.");
  }
};