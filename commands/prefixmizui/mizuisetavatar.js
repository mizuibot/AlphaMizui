const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setavatar",

  async execute(message, args) {

    const url = args[0];

    if (!url) {
      return message.reply(
        "❌ Use: `mizuisetavatar <link>`"
      );
    }

    const db = loadDB();

    if (!db[message.author.id]) {
      db[message.author.id] = {};
    }

    db[message.author.id].customAvatar = url;

    saveDB(db);

    return message.reply(
      "✅ Avatar salvo com sucesso."
    );
  }
};
