const { loadDB, saveDB } = require("../../economy");

module.exports = {
  name: "setbio",

  async execute(message, args) {
const db = loadDB();

console.log("ANTES:", JSON.stringify(db, null, 2));

const user = db[message.author.id];

if (!user) {
  return message.reply("❌ Perfil não encontrado.");
}

user.bio = bio;

console.log("DEPOIS:", JSON.stringify(db, null, 2));

saveDB(db);

    return message.reply("✅ Bio atualizada com sucesso!");
  }
};