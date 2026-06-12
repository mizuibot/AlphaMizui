const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",

  async execute(message, args, client) {

    if (message.author.id !== "1501604830924505300") {
      return message.reply("❌ Apenas meu criador pode usar este comando.");
    }

    const guildId = args[0];

    if (!guildId) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("❌ ID não informado")
        .setDescription(
          "Use:\n`mizuileave <id_do_servidor>`"
        );

      return message.reply({
        embeds: [embed]
      });
    }

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("❌ Servidor não encontrado")
        .setDescription(
          `Não encontrei nenhum servidor com o ID:\n\`${guildId}\``
        );

      return message.reply({
        embeds: [embed]
      });
    }

    const embed = new EmbedBuilder()
      .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
      .setTitle("🚪 Saindo do servidor")
      .addFields(
        {
          name: "📌 Nome",
          value: guild.name,
          inline: false
        },
        {
          name: "🆔 ID",
          value: guild.id,
          inline: false
        },
        {
          name: "👥 Membros",
          value: `${guild.memberCount}`,
          inline: true
        }
      )
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });

    await guild.leave();
  }
};