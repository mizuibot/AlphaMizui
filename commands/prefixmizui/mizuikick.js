const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "kick",

  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("❌ Sem permissão.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("👤 mencione alguém");

    const reason = args.slice(1).join(" ") || "Sem motivo";

    if (!user.kickable) {
      return message.reply("❌ Não posso expulsar esse usuário.");
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`kick_yes_${user.id}`)
        .setLabel("Confirmar Kick")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`kick_no_${user.id}`)
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.reply({
      content: `⚠️ Tem certeza que quer expulsar **${user.user.tag}**?`,
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      time: 15000
    });

    collector.on("collect", async (i) => {

      if (i.user.id !== message.author.id) {
        return i.reply({ content: "❌ Só quem usou o comando pode confirmar.", ephemeral: true });
      }

      if (i.customId.startsWith("kick_yes")) {

        await user.kick(reason);

        await i.update({
          content: `👢 ${user.user.tag} foi expulso.\n📝 Motivo: ${reason}`,
          components: []
        });

      } else {

        await i.update({
          content: "❌ Kick cancelado.",
          components: []
        });
      }
    });

    collector.on("end", async () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  }
};