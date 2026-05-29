const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Ranking global em imagem"),

  async execute(interaction) {

    const url = "http://127.0.0.1:3000/leaderboard-img-global";

    return interaction.reply({
      embeds: [
        {
          title: "🏆 Leaderboard Global",
          color: 0xff66c4,
          image: {
            url: url
          }
        }
      ]
    });
  }
};