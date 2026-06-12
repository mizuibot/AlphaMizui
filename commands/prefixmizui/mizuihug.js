const { addLove, addHug } = require("../../marriagesLove");

module.exports = {
  name: "hug",

  async execute(message) {

    const target = message.mentions.users.first();

    if (!target) {
      return message.reply("❌ Use: `mizuihug @usuário`");
    }

    if (target.bot) {
      return message.reply("🤖 Você não pode abraçar bots.");
    }

    if (target.id === message.author.id) {
      return message.reply("🤨 Você não pode se abraçar.");
    }

    // 💞 GIFS (CDN DISCORD)
    const gifs = [
      "https://cdn.discordapp.com/attachments/1513910997285470450/1513953719862169761/35a212811dc533b8f0e7f9cd3b10389b.gif?ex=6a299ac6&is=6a284946&hm=cde5f19bcad05408f3cff6b15db1541e9a6d4500f602d8fba5db722e612767ec&",
      "https://cdn.discordapp.com/attachments/1513910997285470450/1513953719492804710/854ad7a95a664777e793ec4f80ea1e9d.gif?ex=6a299ac6&is=6a284946&hm=45c29c2eaac5d4c881f874b7c11ae3cf731f3346d5c6133048cea8d8f0a590b9&",
      "https://cdn.discordapp.com/attachments/1513910997285470450/1513953719044145333/10938595451e33510d08501683b6f7b6.gif?ex=6a299ac6&is=6a284946&hm=eda1575c253a4fc1743bb1d119401e24790743fc2cd9c04d4ff47076e21466c1&",
      "https://cdn.discordapp.com/attachments/1513910997285470450/1513953718666789074/422c18a1deb3928d364815ace55611d1.gif?ex=6a299ac6&is=6a284946&hm=2fad049d4f90329cdd5b8c76bca91c90f93c18994c604a94e20964e8f0b23788&"
    ];

    const frases = [
      `🤗 ${message.author} abraçou ${target}.`,
      `💞 ${message.author} deu um abraço caloroso em ${target}.`,
      `✨ ${message.author} e ${target} compartilharam um abraço.`,
      `🫂 ${message.author} envolveu ${target} em um abraço apertado.`
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    const frase = frases[Math.floor(Math.random() * frases.length)];

    addLove(message.author.id, target.id, 5);
    addHug(message.author.id, target.id);

    await message.reply(frase);
    return message.channel.send(gif);
  }
};