const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiantiraid")
    .setDescription("Ativar anti-raid"),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
    }

    global.antiRaid = global.antiRaid || new Set();
    global.antiRaid.add(interaction.guild.id);

    return interaction.reply("🛡️ Anti-raid ativado.");
  }
};