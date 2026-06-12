module.exports = {
  name: "perturbe",

  async execute(message, args, client) {

    client.user.setPresence({
      status: "dnd"
    });

    return message.reply("⛔ Status alterado para Não Perturbe.");
  }
};