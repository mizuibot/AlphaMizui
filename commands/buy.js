const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Comprar algo com mzcoins")
    .addIntegerOption(option =>
      option
        .setName("valor")
        .setDescription("Valor da compra")
        .setRequired(true)
    ),

  async execute(interaction) {

    const value = interaction.options.getInteger("valor");

    guildEco.removeCoins(
      interaction.guild.id,
      interaction.user.id,
      value
    );

    return interaction.reply({
      content: `🛒 Você gastou **${value} mzcoins**`
    });
  }
};