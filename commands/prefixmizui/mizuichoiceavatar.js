module.exports = {
  name: "testavatar",

  async execute(message) {

    console.log(
      "client.user.setAvatar:",
      typeof message.client.user.setAvatar
    );

    console.log(
      "guild.members.me:",
      message.guild.members.me
    );

    return message.reply("Olhe o console.");
  }
};