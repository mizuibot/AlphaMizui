const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Apaga mensagens do chat")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Quantidade de mensagens (1-100)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (!amount || amount < 1 || amount > 100) {
      return interaction.reply({
        content: "⚠️ Escolha um número entre 1 e 100.",
        ephemeral: true,
      });
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "❌ Você não tem permissão.",
        ephemeral: true,
      });
    }

    const deleted = await interaction.channel.bulkDelete(amount, true);

    return interaction.reply({
      content: `🧹 Apaguei ${deleted.size} mensagens.`,
      ephemeral: true,
    });
  },
};