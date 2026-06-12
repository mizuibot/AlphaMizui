const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "ban",

  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("❌ Sem permissão.");
    }

    const target =
      message.mentions.users.first() ||
      await message.client.users.fetch(args[0]).catch(() => null);

    if (!target) {
      return message.reply("❌ Use: mizuiban @usuario motivo");
    }

    const motivo = args.slice(1).join(" ") || "Nenhum motivo informado";

    const member = await message.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return message.reply("❌ Usuário não encontrado no servidor.");
    }

    if (!member.bannable) {
      return message.reply("❌ Não posso banir este usuário.");
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ban_yes_${target.id}`)
        .setLabel("Confirmar Ban")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`ban_no_${target.id}`)
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.reply({
      content: `⚠️ Confirmar ban em **${target.tag}**?`,
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      time: 15000
    });

    collector.on("collect", async (i) => {

      if (i.user.id !== message.author.id) {
        return i.reply({ content: "❌ Só quem usou o comando pode confirmar.", ephemeral: true });
      }

      if (i.customId.startsWith("ban_yes")) {

        await member.ban({ reason: motivo });

        const embed = new EmbedBuilder()
          .setColor(global.getEmbedColor(message.guild.id))
          .setTitle("🔨 Usuário Banido")
          .addFields(
            { name: "👤 Usuário", value: `${target.tag}` },
            { name: "🆔 ID", value: target.id },
            { name: "📝 Motivo", value: motivo },
            { name: "👮 Moderador", value: `${message.author.tag}` }
          )
          .setTimestamp();

        await i.update({
          embeds: [embed],
          components: []
        });

      } else {

        await i.update({
          content: "❌ Ban cancelado.",
          components: []
        });
      }
    });

    collector.on("end", async () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  }
};