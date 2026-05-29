const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgatar recompensa diária"),

  async execute(interaction) {

    const reward = 350;

    guildEco.addCoins(
      interaction.guild.id,
      interaction.user.id,
      reward,
      interaction.user.username,
      interaction.user.displayAvatarURL({
        dynamic: true,
        size: 128
      })
    );

    return interaction.reply({
      content: `🎁 Você recebeu **${reward} mzcoins** de daily`
    });
  }
};