module.exports = {
  name: "avatar",

  async execute(message, args, client) {
    const user =
      message.mentions.users.first() ||
      message.author;

    const avatarURL = user.displayAvatarURL({
      size: 1024,
      extension: "png",
      dynamic: true,
    });

    return message.reply({
      content: `🖼️ Avatar de **${user.username}**`,
      files: [avatarURL],
    });
  },
};