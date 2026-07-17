const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setcoins",

  async execute(message, args) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Apenas os donos podem usar este comando.");
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

    // Garante perfil
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
