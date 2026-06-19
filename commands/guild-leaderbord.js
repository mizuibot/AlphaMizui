const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboardlocal")
    .setDescription("Ranking de moedas do servidor"),

  async execute(interaction) {
    await interaction.deferReply();

    let db;

    // =========================
    // LOAD DB
    // =========================
    try {
      db = JSON.parse(fs.readFileSync("./economy.json", "utf8") || "{}");
    } catch (err) {
      console.log(err);
      return interaction.editReply("❌ Erro ao carregar banco de dados.");
    }

    // =========================
    // ⚠️ FIX PRINCIPAL (SEM FETCH PESADO)
    // =========================
    const members = interaction.guild.members.cache;

    // =========================
    // FILTER + SORT
    // =========================
    const users = Object.entries(db)
      .filter(([id]) => members.has(id))
      .sort((a, b) => {
        const coinsA = Number(a[1]?.coins || 0);
        const coinsB = Number(b[1]?.coins || 0);
        return coinsB - coinsA;
      })
      .slice(0, 10);

    // =========================
    // EMPTY CHECK
    // =========================
    if (!users.length) {
      return interaction.editReply(
        "Ninguém possui moedas ainda neste servidor."
      );
    }

    // =========================
    // BUILD RANKING
    // =========================
    let ranking = "";

    users.forEach((user, index) => {
      ranking += `**${index + 1}.** ${user[1]?.username || "Desconhecido"}\n`;
      ranking += `💰 Coins: \`${user[1]?.coins || "0"}\`\n\n`;
    });

    // =========================
    // EMBED
    // =========================
    const embed = new EmbedBuilder()
      .setTitle(`🏰 Leaderboard • ${interaction.guild.name}`)
      .setDescription(ranking)
      .setColor(global.getEmbedColor?.(interaction.guild.id) || 0x00AE86)
      .setFooter({
        text: `Top ${users.length} membros`
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
