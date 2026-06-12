const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiunlock")
    .setDescription("Destranca um canal"),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: "Sem permissão.", ephemeral: true });
    }

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
    });

    const embed = new EmbedBuilder()
      .setTitle("🔓 Canal liberado")
      .setDescription(`O canal foi desbloqueado por ${interaction.user.tag}`)
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)

    return interaction.reply({ embeds: [embed] });
  },
};