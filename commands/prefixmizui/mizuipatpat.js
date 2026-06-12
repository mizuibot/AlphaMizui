const { addLove, addPatPat } = require("../../marriagesLove");

module.exports = {
name: "patpat",

async execute(message) {

const target = message.mentions.users.first();

if (!target) {
  return message.reply("❌ Use: `mizuipatpat @usuário`");
}

if (target.bot) {
  return message.reply("🤖 Você não pode fazer patpat em bots.");
}

if (target.id === message.author.id) {
  return message.reply("🤨 Você não pode fazer patpat em si mesmo.");
}

// 🖐️ GIFS PATPAT
const gifs = [
  "https://cdn.discordapp.com/attachments/1474846905807933602/1514270039753228488/image2.gif",
  "https://cdn.discordapp.com/attachments/1474846905807933602/1514270039266820207/image1.gif",
  "https://cdn.discordapp.com/attachments/1474846905807933602/1514270040080519188/image3.gif",
  "https://cdn.discordapp.com/attachments/1474846905807933602/1514270038910046258/image0.gif"
];

const frases = [
  `🖐️ ${message.author} fez carinho na cabeça de ${target}.`,
  `✨ ${message.author} deu um patpat fofinho em ${target}.`,
  `💜 ${message.author} acariciou a cabeça de ${target}.`,
  `🌙 ${message.author} fez um patpat carinhoso em ${target}.`
];

const gif = gifs[Math.floor(Math.random() * gifs.length)];
const frase = frases[Math.floor(Math.random() * frases.length)];

addLove(message.author.id, target.id, 3);
addPatPat(message.author.id, target.id);

await message.reply(frase);
return message.channel.send(gif);

}
};