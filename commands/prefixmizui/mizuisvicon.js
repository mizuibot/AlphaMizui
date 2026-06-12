module.exports = {
  name: "servericon",

  async execute(message) {

    const icon = message.guild.iconURL({ dynamic: true, size: 1024 });

    if (!icon) {
      return message.reply("❌ Esse servidor não tem ícone.");
    }

    return message.reply(icon);
  }
};