const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../economy");

module.exports = {
  name: "bank",

  async execute(message) {

    const user = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL({
        dynamic: true,
        size: 512
      })
    );

    const embed = new EmbedBuilder()
      .setTitle("🏦 Banco Mizui")
      .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
      .setThumbnail(
        message.author.displayAvatarURL({
          dynamic: true,
          size: 512
        })
      )
      .addFields(
        {
          name: "👤 Usuário",
          value: `${message.author}`,
          inline: false
        },
        {
          name: "🏦 Saldo Bancário",
          value: `${user.bank.toLocaleString()} MZCoins`,
          inline: true
        }
      )
      .setFooter({
        text: "Mizui Economy System"
      })
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};