const { SlashCommandBuilder } = require("discord.js");
const guildEco = require("../guild-economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pagar outro usuário")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Usuário")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("valor")
        .setDescription("Valor em mzcoins")
        .setRequired(true)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser("user");
    const value = interaction.options.getInteger("valor");

    guildEco.removeCoins(
      interaction.guild.id,
      interaction.user.id,
      value
    );

    guildEco.addCoins(
      interaction.guild.id,
      user.id,
      value,
      user.username,
      user.displayAvatarURL({
        dynamic: true,
        size: 128
      })
    );

    return interaction.reply({
      content:
        `💸 Você pagou **${value} mzcoins** para ${user.username}`
    });
  }
};