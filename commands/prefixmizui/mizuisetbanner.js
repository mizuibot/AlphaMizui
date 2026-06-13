const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbanner",

  async execute(message, args) {
    const url = args[0];

    if (!url) {
      return message.reply("❌ Use: mizuisetbanner <link>");
    }

    // 🔥 validação básica de imagem direta
    if (!url.match(/\.(png|jpg|jpeg|webp)$/)) {
      return message.reply("❌ Use link direto de imagem (.png/.jpg/.jpeg/.webp)");
    }

    const db = loadDB();

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

    db[message.author.id].background = url;

    saveDB(db);

    return message.reply("✅ Banner salvo com sucesso!");
  }
};
