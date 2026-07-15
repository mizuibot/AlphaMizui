const { EmbedBuilder } = require("discord.js");

const AUTORIZADOS = [
  "1501604830924505300",
  "1290497952653119564"
];

module.exports = {
  name: "off",

  async execute(message) {

    if (!AUTORIZADOS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão para usar este comando.");
    }

    const embed = new EmbedBuilder()
      .setColor(global.getEmbedColor(message.guild.id))
      .setTitle("🔌 Sistema")
      .setDescription("**Até a próxima!**\n\n*Mizui desligando...*")
      .setThumbnail(message.client.user.displayAvatarURL())
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });

    setTimeout(() => {
      message.client.destroy();
      process.exit(0);
    }, 1500);

  }
};
