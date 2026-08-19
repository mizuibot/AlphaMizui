const { createQuote } = require("../utils/quoteRenderer");

module.exports = {
  name: "quote",

  async execute(message, args) {
    const text = args.join(" ");

    if (!text) {
      return message.reply("❌ Escreva alguma coisa para eu criar o quote.");
    }

    const image = await createQuote({
      avatarUrl: message.author.displayAvatarURL({
        extension: "png",
        size: 512
      }),
      text,
      username: message.author.username,
      displayName: message.author.displayName
    });

    await message.reply({
      files: [
        {
          attachment: image,
          name: "quote.png"
        }
      ]
    });
  }
};
