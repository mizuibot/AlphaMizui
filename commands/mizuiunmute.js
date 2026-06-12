const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiunmute")
    .setDescription("Remove o timeout de um usuário")
    .addUserOption(o =>
      o
        .setName("user")
        .setDescription("Usuário a ser desmutado")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(null);

    const embed = new EmbedBuilder()
      .setTitle("🔊 Usuário desmutado")
      .setDescription(`${user.tag} foi desmutado`)
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)

    return interaction.reply({ embeds: [embed] });
  },
};