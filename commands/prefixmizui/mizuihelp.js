const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "help",

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor(
        global.getEmbedColor(
          message.guild.id
        )
      )
      .setTitle("📚 Central de Comandos da Mizui")
      .setDescription(
        "Todos os comandos prefixados e slash estão disponíveis na central de ajuda."
      )
      .setImage(
        "https://mizuichanhelp.netlify.app/preview.png"
      )
      .setFooter({
        text: "MizuiChan Help Center"
      });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Abrir Central")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://mizuichanhelp.netlify.app/"
          )
      );

    return message.reply({
      embeds: [embed],
      components: [row]
    });
  }
};