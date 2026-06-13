const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setavatar",

  async execute(message, args) {
    const url = args[0];
    if (!url) return message.reply("❌ Use: mizuisetavatar <link>");

    const db = loadDB();

    // 🔥 garante perfil
    if (!db[message.author.id]) {
      db[message.author.id] = {
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

    const user = db[message.author.id];

    user.customAvatar = url;

    saveDB(db);

    return message.reply("✅ Avatar salvo com sucesso!");
  }
};