const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",

  async execute(message, args, client) {
    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle("⏱️ Uptime da Mizui")
      .setDescription(`Online há **${hours}h ${minutes}m ${seconds}s**`)
      .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)

    return message.reply({ embeds: [embed] });
  },
};