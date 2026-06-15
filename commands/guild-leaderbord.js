const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboardlocal")
    .setDescription("Ranking do servidor (ou global se usado fora)"),

  async execute(interaction) {
    const db = JSON.parse(fs.readFileSync("./economy.json", "utf8"));
    const usersDB = Object.entries(db.users || {});

    let users = [];

    // =========================
    // 🏰 SERVER MODE
    // =========================
    if (interaction.guild) {
      const members = await interaction.guild.members.fetch();

      users = usersDB
        .filter(([id]) => members.has(id))
        .sort((a, b) => {
          const coinsA = BigInt(a[1]?.coins || "0");
          const coinsB = BigInt(b[1]?.coins || "0");
          return coinsB > coinsA ? -1 : 1;
        })
        .slice(0, 10);
    }

    // =========================
    // 🌍 GLOBAL MODE
    // =========================
    else {
      users = usersDB
        .sort((a, b) => {
          const coinsA = BigInt(a[1]?.coins || "0");
          const coinsB = BigInt(b[1]?.coins || "0");
          return coinsB > coinsA ? -1 : 1;
        })
        .slice(0, 10);
    }

    if (users.length === 0) {
      return interaction.reply({
        content: "Ninguém possui moedas ainda.",
        ephemeral: true
      });
    }

    let ranking = "";

    users.forEach((user, index) => {
      const coins = BigInt(user[1]?.coins || "0");

      ranking += `**${index + 1}.** ${user[1]?.username || "Unknown"}\n`;
      ranking += `💰 Coins: \`${coins.toString()}\`\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(
        interaction.guild
          ? `🏰 Leaderboard • ${interaction.guild.name}`
          : "🌍 Leaderboard Global"
      )
      .setDescription(ranking)
      .setColor(
        interaction.guild
          ? global.getEmbedColor(interaction.guild.id)
          : "#9370DB"
      )
      .setFooter({
        text: `Top ${users.length} membros`
      })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed]
    });
  }
};
