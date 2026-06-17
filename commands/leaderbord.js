const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Ranking global de moedas"),

  async execute(interaction) {
    await interaction.deferReply();

    let db;

    try {
      db = JSON.parse(fs.readFileSync("./economy.json", "utf8"));
    } catch (err) {
      return interaction.editReply("❌ Erro ao ler o banco de dados.");
    }

    const allUsers = Object.values(db.guilds || {})
      .flatMap(guild => const users = Object.entries(db || {})

    if (allUsers.length === 0) {
      return interaction.editReply("Ninguém possui moedas ainda.");
    }

    const topUsers = allUsers
      .sort((a, b) => {
        const bCoins = BigInt(b[1]?.coins || "0");
        const aCoins = BigInt(a[1]?.coins || "0");
        return bCoins > aCoins ? -1 : 1;
      })
      .slice(0, 10);

    let ranking = "";

    topUsers.forEach((user, index) => {
      ranking += `**${index + 1}.** ${user[1]?.username || "Desconhecido"}\n`;
      ranking += `💰 Coins: \`${user[1]?.coins || "0"}\`\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Global")
      .setDescription(ranking)
      .setColor(global.getEmbedColor(interaction.guild.id))
      .setFooter({ text: `Top ${topUsers.length} jogadores` })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
