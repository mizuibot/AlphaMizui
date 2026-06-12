module.exports = {
  name: "serverbanner",

  async execute(message) {

    const banner = message.guild.bannerURL({ size: 1024, dynamic: true });

    if (!banner) {
      return message.reply("❌ Esse servidor não tem banner.");
    }

    return message.reply({
      files: [banner]
    });
  }
};