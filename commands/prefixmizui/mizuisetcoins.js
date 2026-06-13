const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setcoins",

  async execute(message, args) {
    // 🔒 apenas dono (troque pelo seu ID)
    const OWNER_ID = "1501604830924505300";

    if (message.author.id !== OWNER_ID) {
      return message.reply("❌ Apenas o dono pode usar isso.");
    }

    const target =
      message.mentions.users.first() ||
      await message.client.users.fetch(args[0]).catch(() => null);

    const amount = args[1];

    if (!target) {
      return message.reply("❌ Usuário inválido.");
    }

    if (!amount || isNaN(amount)) {
      return message.reply("❌ Use: mizuisetcoins @user valor");
    }

    const db = loadDB();

    // 🔥 garante perfil
    if (!db[target.id]) {
      db[target.id] = {
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

    db[target.id].coins = BigInt(amount).toString();

    saveDB(db);

    return message.reply(
      `✅ Coins de ${target.username} alteradas para ${amount}`
    );
  }
};