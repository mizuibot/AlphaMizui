module.exports = {
  name: "ausente",

  async execute(message, args, client) {

    client.user.setPresence({
      status: "idle"
    });

    return message.reply("🌙 Status alterado para Ausente.");
  }
};