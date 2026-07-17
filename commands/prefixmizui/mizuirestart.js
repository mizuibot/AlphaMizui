module.exports = {
  name: "restart",

  async execute(message) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão.");
    }

    await message.reply("🔄 Reiniciando a Mizui...");

    process.exit(0);
  },
};
