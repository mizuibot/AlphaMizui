const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setavatar",

  async execute(message, args) {
    const url = args[0];

    if (!url) {
      return message.reply("❌ Use: mizuisetavatar <link>");
    }

    const db = loadDB();
    const user = db[message.author.id];

    if (!user) return message.reply("❌ Perfil não encontrado.");

    user.customAvatar = url;

    saveDB(db);

    return message.reply("✅ Avatar salvo com sucesso.");
  }
};