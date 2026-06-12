const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiantilink")
    .setDescription("Ativar anti-link"),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
    }

    global.antiLink = global.antiLink || new Set();
    global.antiLink.add(interaction.guild.id);

    return interaction.reply("🔗 Anti-link ativado.");
  }
};