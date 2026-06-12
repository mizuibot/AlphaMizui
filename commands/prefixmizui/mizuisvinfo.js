const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",

  async execute(message) {

    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setTitle("🏰 Info do Servidor")
      .addFields(
        { name: "Nome", value: guild.name, inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Membros", value: `${guild.memberCount}`, inline: true }
      )
      .setColor(global.getEmbedColor(guild.id))
      .setThumbnail(guild.iconURL({ dynamic: true }));

    return message.reply({ embeds: [embed] });
  }
};