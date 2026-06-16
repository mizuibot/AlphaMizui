const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboardlocal")
    .setDescription("Ranking de moedas do servidor"),

  async execute(interaction) {
    await interaction.deferReply();

    let db;

    try {
      db = JSON.parse(fs.readFileSync("./guild-economy.json", "utf8"));
    } catch (err) {
      return interaction.editReply("❌ Erro ao carregar banco de dados.");
    }

    const guildId = interaction.guild.id;

    const guildData = db.guilds?.[guildId]?.users;

    if (!guildData || Object.keys(guildData).length === 0) {
      return interaction.editReply("Ninguém possui moedas ainda neste servidor.");
    }

    const users = Object.entries(guildData)
      .sort((a, b) => {
        const coinsA = BigInt(a[1]?.coins || "0");
        const coinsB = BigInt(b[1]?.coins || "0");
        return coinsB > coinsA ? -1 : 1;
      })
      .slice(0, 10);

    let ranking = "";

    users.forEach((user, index) => {
      ranking += `**${index + 1}.** ${user[1]?.username || "Desconhecido"}\n`;
      ranking += `💰 Coins: \`${user[1]?.coins || "0"}\`\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`🏰 Leaderboard • ${interaction.guild.name}`)
      .setDescription(ranking)
      .setColor(global.getEmbedColor(interaction.guild.id))
      .setFooter({ text: `Top ${users.length} membros` })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
