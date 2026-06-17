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
      db = JSON.parse(
        fs.readFileSync("./economy.json", "utf8")
      );
    } catch (err) {
      console.log(err);
      return interaction.editReply(
        "❌ Erro ao ler o banco de dados."
      );
    }

    const allUsers = Object.entries(db || {});

    if (allUsers.length === 0) {
      return interaction.editReply(
        "Ninguém possui moedas ainda."
      );
    }

    const topUsers = allUsers
      .sort((a, b) => {
        const coinsA = BigInt(
          a[1]?.coins || "0"
        );

        const coinsB = BigInt(
          b[1]?.coins || "0"
        );

        if (coinsB > coinsA) return 1;
        if (coinsB < coinsA) return -1;
        return 0;
      })
      .slice(0, 10);

    let ranking = "";

    topUsers.forEach((user, index) => {
      ranking +=
        `**${index + 1}.** ${
          user[1]?.username ||
          "Desconhecido"
        }\n`;

      ranking +=
        `💰 Coins: \`${
          user[1]?.coins || "0"
        }\`\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Global")
      .setDescription(ranking)
      .setColor(
        interaction.guild
          ? global.getEmbedColor(
              interaction.guild.id
            )
          : "#9370DB"
      )
      .setFooter({
        text: `Top ${topUsers.length} jogadores`
      })
      .setTimestamp();

    return interaction.editReply({
      embeds: [embed]
    });
  }
};
