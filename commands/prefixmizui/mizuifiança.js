const { EmbedBuilder } = require("discord.js");
const { loadDB, saveDB } = require("../../economy");

module.exports = {
name: "fianca",

async execute(message, args) {

// 👤 usuário que será libertado
const target = message.mentions.users.first();

if (!target) {
  return message.reply("❌ Use: `mizuifianca @usuário`");
}

const userId = target.id;
const payerId = message.author.id;

// 🚨 verifica prisão
const jailedUntil = global.jail.get(userId);

if (!jailedUntil || jailedUntil <= Date.now()) {
  return message.reply("❌ Esse usuário não está preso.");
}

// 💰 valor da fiança
const FIANCA = 345000n;

const db = loadDB();

// garante pagador existe
if (!db.users[payerId]) {
  return message.reply("❌ Você não possui conta na economia.");
}

const wallet = BigInt(db.users[payerId].coins || "0");
const bank = BigInt(db.users[payerId].bank || "0");

const total = wallet + bank;

if (total < FIANCA) {
  return message.reply(
    `❌ Você não possui **${FIANCA.toLocaleString("pt-BR")} mzcoins** para pagar a fiança.`
  );
}

let remaining = FIANCA;

// tira da carteira primeiro
if (wallet >= remaining) {
  db.users[payerId].coins =
    (wallet - remaining).toString();

  remaining = 0n;
} else {
  db.users[payerId].coins = "0";
  remaining -= wallet;
}

// depois do banco
if (remaining > 0n) {
  db.users[payerId].bank =
    (bank - remaining).toString();
}

saveDB(db);

// liberta o preso
global.jail.delete(userId);

const embed = new EmbedBuilder()
  .setColor(global.getEmbedColor(message.guild.id))
  .setTitle("⚖️ Fiança paga!")
  .setDescription(
    `${target} foi libertado da prisão.\n\n💸 ${message.author} pagou **${FIANCA.toLocaleString("pt-BR")} mzcoins** pela fiança.`
  )
  .addFields(
    {
      name: "👤 Libertado",
      value: `${target}`,
      inline: true
    },
    {
      name: "💰 Pagador",
      value: `${message.author}`,
      inline: true
    }
  )
  .setTimestamp();

return message.reply({ embeds: [embed] });

}
};