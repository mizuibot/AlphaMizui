const { addLove, addKiss } = require("../../marriagesLove");

module.exports = {
  name: "kiss",

  async execute(message) {

    const target = message.mentions.users.first();

    if (!target) {
      return message.reply("❌ Use: `mizuikiss @usuário`");
    }

    if (target.bot) {
      return message.reply("🤖 Você não pode beijar bots.");
    }

    if (target.id === message.author.id) {
      return message.reply("🤨 Você não pode se beijar.");
    }

    // 💋 GIFS DE BEIJO (DISCORD CDN — ESTÁVEIS)
    const gifs = [
      "https://cdn.discordapp.com/attachments/1474943278830063647/1513941176569565184/f81f93b2bb3798c51e93776370e63c59.gif",
      "https://cdn.discordapp.com/attachments/1474943278830063647/1513941147620479177/74fcba28cf3f31ed2d2adfde82e19de5.gif",
      "https://cdn.discordapp.com/attachments/1474943278830063647/1513941105610326086/5c01b9519ebdad0ed42dd2eb0a215fcc.gif",
      "https://cdn.discordapp.com/attachments/1474943278830063647/1513941168168108224/2bce066207907ba96bc06a2151552b01.gif"
    ];

    const frases = [
      `💋 ${message.author} beijou ${target}.`,
      `💕 ${message.author} deu um beijo em ${target}.`,
      `✨ ${message.author} e ${target} compartilharam um beijo.`,
      `💖 ${message.author} demonstrou amor por ${target}.`
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    const frase = frases[Math.floor(Math.random() * frases.length)];

    // 💞 sistema de amor
    addLove(message.author.id, target.id, 10);
    addKiss(message.author.id, target.id);

    // 💬 texto + gif (igual handshake/hug)
    await message.reply(frase);
    return message.channel.send(gif);
  }
};