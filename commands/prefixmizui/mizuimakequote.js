const { createQuote } = require("../../utils/quoteRenderer");

module.exports = {
  name: "quote",

  async execute(message) {
    // Verifica se você respondeu alguma mensagem
    if (!message.reference) {
      return message.reply("❌ Responda a uma mensagem para criar um quote.");
    }

    // Busca a mensagem respondida
    const quotedMessage = await message.channel.messages.fetch(
      message.reference.messageId
    );

    if (!quotedMessage) {
      return message.reply("❌ Não consegui encontrar essa mensagem.");
    }

    const image = await createQuote({
      avatarUrl: quotedMessage.author.displayAvatarURL({
        extension: "png",
        size: 512
      }),

      text: quotedMessage.content,

      username: quotedMessage.author.username,

      displayName: quotedMessage.author.displayName
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
