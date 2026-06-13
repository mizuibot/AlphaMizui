const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbanner",

  async execute(message, args) {
    const url = args[0];

    if (!url) {
      return message.reply("❌ Use: mizuisetbanner <link>");
    }

    const db = loadDB();
    const user = db[message.author.id];

    if (!user) return message.reply("❌ Perfil não encontrado.");

    user.background = url;

    saveDB(db);

    return message.reply("✅ Banner salvo com sucesso.");
  }
};
