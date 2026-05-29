const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboardlocal")
    .setDescription("Ranking do servidor em imagem"),

  async execute(interaction) {

    const url =
      `http://127.0.0.1:3000/leaderboard-img/${interaction.guild.id}`;

    return interaction.reply({
      embeds: [
        {
          title: "🏰 Leaderboard do Servidor",
          color: 0xff1493,
          image: {
            url: url
          }
        }
      ]
    });
  }
};