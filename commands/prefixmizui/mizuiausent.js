module.exports = {
  name: "ausente",

  async execute(message, args, client) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão para usar este comando.");
    }

    client.user.setPresence({
      status: "idle"
    });

    return message.reply("🌙 Status alterado para Ausente.");
  }
};
