const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("choiceavatar")
    .setDescription("Altera o avatar da Mizui.")
    .addAttachmentOption(option =>
      option
        .setName("imagem")
        .setDescription("Imagem para o novo avatar.")
        .setRequired(true)
    ),

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

    const imagem =
      interaction.options.getAttachment("imagem");

    if (!imagem.contentType?.startsWith("image/")) {
      return interaction.reply({
        content: "❌ O arquivo precisa ser uma imagem.",
        ephemeral: true
      });
    }

    try {
      await client.user.setAvatar(imagem.url);

      return interaction.reply(
        "✅ Avatar da Mizui alterado com sucesso!"
      );

    } catch (err) {
      console.error(err);

      return interaction.reply({
        content: "❌ Erro ao alterar o avatar.",
        ephemeral: true
      });
    }
  },
};
