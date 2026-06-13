const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbanner",

  async execute(message, args) {

    const url = args[0];

    if (!url) {
      return message.reply(
        "❌ Use: `mizuisetbanner <link>`"
      );
    }

    const db = loadDB();

    if (!db[message.author.id]) {
      db[message.author.id] = {};
    }

    db[message.author.id].background = url;

    saveDB(db);

    return message.reply(
      "✅ Banner salvo com sucesso."
    );
  }
};
