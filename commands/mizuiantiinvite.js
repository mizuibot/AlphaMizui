const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiantiinvite")
    .setDescription("Ativar anti-invite"),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
    }

    global.antiInvite = global.antiInvite || new Set();
    global.antiInvite.add(interaction.guild.id);

    return interaction.reply("🚫 Anti-invite ativado.");
  }
};