const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antifarm")
    .setDescription("Ativar sistema anti-farm (simples)"),

  async execute(interaction) {
    return interaction.reply("🛡️ Sistema anti-farm está ativo (base pronta)");
  }
};