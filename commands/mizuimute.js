const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

function parseTime(str) {
  if (!str) return null;

  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuimute")
    .setDescription("Mutar um usuário por tempo")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("Usuário para mutar")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("time")
        .setDescription("Tempo (ex: 10m, 1h, 30s)")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({
        content: "❌ Você não tem permissão para mutar membros.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const time = interaction.options.getString("time");

    const ms = parseTime(time);

    if (!ms) {
      return interaction.reply({
        content: "❌ Tempo inválido. Use ex: 10m, 1h, 30s",
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(ms, "Mute aplicado pelo bot");

    const embed = new EmbedBuilder()
      .setTitle("🔇 Usuário mutado")
      .setDescription(`${user.tag} foi mutado por ${time}`)
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)

    return interaction.reply({ embeds: [embed] });
  },
};