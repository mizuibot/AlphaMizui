const {
  SlashCommandBuilder
} = require("discord.js");

module.exports = {

  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Mostra a central de comandos da Mizui"),

  async execute(interaction) {

    await interaction.reply(
      "📚 Central de comandos da Mizui:\nhttps://mizuichanhelp.netlify.app/"
    );

  }
};