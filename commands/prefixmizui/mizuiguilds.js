const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guilds",

  async execute(message, args, client) {

    if (message.author.id !== "1501604830924505300") {
      return;
    }

    const guilds = [...client.guilds.cache.values()];

    const description = guilds
      .map(
        (g, i) =>
          `**${i + 1}.** ${g.name}\n🆔 \`${g.id}\`\n👥 ${g.memberCount} membros`
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
      .setTitle(`🌎 Servidores da Mizui (${guilds.length})`)
      .setDescription(
        description || "Nenhum servidor."
      )
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};