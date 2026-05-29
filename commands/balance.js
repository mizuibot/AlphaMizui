const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver seu saldo de mzcoins"),

  async execute(interaction) {

    const user = guildEco.getUser(
      interaction.guild.id,
      interaction.user.id,
      interaction.user.username,
      interaction.user.displayAvatarURL({
        dynamic: true,
        size: 128
      })
    );

    return interaction.reply({
      content: `💰 Você tem **${user.coins} mzcoins**`
    });
  }
};