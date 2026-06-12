module.exports = {
  name: "handshake",

  async execute(message) {

    const target = message.mentions.users.first();

    if (!target) {
      return message.reply("❌ Use: `mizuihandshake @usuário`");
    }

    if (target.bot) {
      return message.reply("🤖 Você não pode usar este comando com bots.");
    }

    if (target.id === message.author.id) {
      return message.reply("🤨 Você não pode apertar a própria mão.");
    }

    const gifs = [
      "https://c.tenor.com/uJ4U79P2uFEAAAAd/hunter-x-hunter-high-five.gif",
      "https://c.tenor.com/z03IQFscXtkAAAAd/portgas-d-ace-ace.gif",
      "https://c.tenor.com/MQu8C6IejlYAAAAd/black-star-death-the-kid.gif",
      "https://c.tenor.com/x_DBAYcMJN0AAAAd/nichijou-handshake.gif"
    ];

    const frases = [
      `🤝 ${message.author} apertou a mão de ${target}.`,
      `✨ ${message.author} cumprimentou ${target}.`,
      `💪 ${message.author} e ${target} trocaram um aperto de mão firme.`,
      `🎉 ${message.author} e ${target} selaram amizade com um handshake.`
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    const frase = frases[Math.floor(Math.random() * frases.length)];

    // 🔥 IMPORTANTE: manda EM DOIS MENSAGENS
    await message.reply(frase);

    // 💥 isso faz o Discord renderizar o GIF automaticamente
    return message.channel.send(gif);
  }
};