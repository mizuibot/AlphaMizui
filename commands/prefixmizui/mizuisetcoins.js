const { loadDB, saveDB } = require("../../economy");

// 🔥 COLOCA SEU ID AQUI
const OWNER_ID = "1501604830924505300";

module.exports = {
  name: "setcoins",

  async execute(message, args) {
    if (message.author.id !== OWNER_ID) {
      return message.reply("❌ Apenas o dono pode usar este comando.");
    }

    const userId = args[0];
    const amount = args[1];

    if (!userId || !amount) {
      return message.reply("❌ Use: setcoins <userId> <quantia>");
    }

    let value;
    try {
      value = BigInt(amount);
    } catch {
      return message.reply("❌ Valor inválido (use número ou bigint).");
    }

    const db = loadDB();

    // garante usuário
    if (!db[userId]) {
      db[userId] = {
        coins: "0",
        bank: "0",
        work: 0,
        daily: 0,
        inventory: [],
        cooldowns: {},
        background: null,
        bio: "",
        customAvatar: null
      };
    }

    db[userId].coins = value.toString();

    saveDB(db);

    return message.reply(
      `✅ Coins definidas com sucesso!\n👤 User: ${userId}\n💰 Coins: ${value.toString()}`
    );
  }
};