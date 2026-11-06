
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resetavatar")
    .setDescription("Restaura o avatar original do Developer Portal."),

  async execute(interaction, client) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ Você não tem permissão.",
        ephemeral: true
      });
    }

    try {
      const application = await client.application.fetch();

      const portalIcon = application.iconURL({
        extension: "png",
        size: 1024
      });

      if (!portalIcon) {
        return interaction.reply({
          content: "❌ A aplicação não possui um ícone configurado.",
          ephemeral: true
        });
      }

      await client.user.setAvatar(portalIcon);

      return interaction.reply(
        "✅ Avatar da Mizui restaurado para o ícone do Developer Portal!"
      );

    } catch (err) {
      console.error("ERRO RESET AVATAR:", err);

      return interaction.reply({
        content: "❌ Não foi possível restaurar o avatar.",
        ephemeral: true
      });
    }
  },
};

