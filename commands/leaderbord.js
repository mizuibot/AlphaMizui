const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Ranking global"),

  async execute(interaction) {

  await interaction.deferReply();

  const db = JSON.parse(fs.readFileSync("./economy.json", "utf8"));

    const users = Object.entries(db.users || {})
      .sort((a, b) =>
  BigInt(b[1].coins || 0) >
  BigInt(a[1].coins || 0)
    ? 1
    : -1
)
      .slice(0, 10);

    if (users.length === 0) {
      return interaction.reply({
        content: "Ninguém possui moedas ainda.",
        ephemeral: true
      });
    }

    let ranking = "";

    users.forEach((user, index) => {
      ranking += `**${index + 1}.** ${user[1].username}\n`;
      ranking += `💰 Coins: \`${user[1].coins}\`\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Global")
      .setDescription(ranking)
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)
      .setFooter({
        text: `Top ${users.length} jogadores`
      })
      .setTimestamp();

    return interaction.editReply({
    embeds: [embed]
  });
}
};