const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antifarm")
    .setDescription("Ativar sistema anti-farm global"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("🛡️ Anti-Farm Ativado")
      .setDescription("Sistema global de proteção contra farm excessivo foi ativado.")
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)
      .addFields(
        { name: "📌 Status", value: "Ativo", inline: true },
        { name: "⏱️ Cooldown Daily", value: "24 horas", inline: true }
      );

    return interaction.reply({ embeds: [embed] });
  }
};