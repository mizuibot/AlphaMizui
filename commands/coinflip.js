const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Jogue cara ou coroa")
    .addIntegerOption(option =>
      option
        .setName("aposta")
        .setDescription("Valor da aposta")
        .setRequired(true)
    ),

  async execute(interaction) {

    const aposta = interaction.options.getInteger("aposta");

    const resultado = Math.random() < 0.5
      ? "cara"
      : "coroa";

    if (resultado === "cara") {

      guildEco.addCoins(
        interaction.guild.id,
        interaction.user.id,
        aposta,
        interaction.user.username,
        interaction.user.displayAvatarURL({
          dynamic: true,
          size: 128
        })
      );

      return interaction.reply(
        `🪙 Deu **CARA**! Você ganhou ${aposta} mzcoins`
      );

    } else {

      guildEco.removeCoins(
        interaction.guild.id,
        interaction.user.id,
        aposta
      );

      return interaction.reply(
        `🪙 Deu **COROA**! Você perdeu ${aposta} mzcoins`
      );
    }
  }
};