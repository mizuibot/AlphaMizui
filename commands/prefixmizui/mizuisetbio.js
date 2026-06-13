const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbio",

  async execute(message, args) {
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

    const bio = args.join(" ").trim();
    if (!bio) return message.reply("❌ Escreve uma bio.");

    user.bio = bio;

    saveDB(db);

    return message.reply("✅ Bio atualizada com sucesso!");
  }
};
