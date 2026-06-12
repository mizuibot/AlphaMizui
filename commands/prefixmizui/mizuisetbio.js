const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbio",

  async execute(message, args) {
    const db = loadDB();

    const user = db[message.author.id];

    if (!user) {
      return message.reply("❌ Perfil não encontrado.");
    }

    const bio = args.join(" ").trim();

    if (!bio) {
      return message.reply("❌ Escreve uma bio. Ex: !setbio sou o melhor player");
    }

    if (bio.length > 120) {
      return message.reply("❌ Bio muito grande (máx 120 caracteres).");
    }

    user.bio = bio;

    saveDB(db);

    return message.reply("✅ Bio atualizada com sucesso!");
  }
};