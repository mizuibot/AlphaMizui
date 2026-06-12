const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiantibot")
    .setDescription("Bloquear bots"),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
    }

    global.antiBot = global.antiBot || new Set();
    global.antiBot.add(interaction.guild.id);

    return interaction.reply("🤖 Anti-bot ativado.");
  }
};