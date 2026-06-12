module.exports = {
  name: "on",

  async execute(message, args, client) {

    client.user.setPresence({
      status: "online",
      activities: [{
        name: "Mizui está online",
        type: 4
      }]
    });

    return message.reply("✅ Status alterado para Online.");
  }
};