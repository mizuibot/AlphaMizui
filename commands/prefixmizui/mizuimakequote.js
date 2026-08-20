const { createQuote } = require("../../utils/quoteRenderer");
const { loadDB } = require("../../economy");

module.exports = {
  name: "quote",

  async execute(message) {
    // =========================
    // VERIFICA SE RESPONDEU UMA MENSAGEM
    // =========================

    if (!message.reference) {
      return message.reply(
        "❌ Responda a uma mensagem para criar um quote."
      );
    }

    // =========================
    // CARREGA CONFIGURAÇÃO
    // =========================

    const db = loadDB();
    const guildData = db[message.guild.id];

    if (!guildData || !guildData.quoteChannel) {
      return message.reply(
        "❌ Nenhum canal de quote foi configurado. Use `/selectquote` primeiro."
      );
    }

    // =========================
    // BUSCA O CANAL CONFIGURADO
    // =========================

    const quoteChannel = await message.guild.channels
      .fetch(guildData.quoteChannel)
      .catch(() => null);

    if (!quoteChannel) {
      return message.reply(
        "❌ O canal de quote configurado não existe mais."
      );
    }

    // =========================
    // BUSCA A MENSAGEM RESPONDIDA
    // =========================

    const quotedMessage = await message.channel.messages.fetch(
      message.reference.messageId
    ).catch(() => null);

    if (!quotedMessage) {
      return message.reply(
        "❌ Não consegui encontrar essa mensagem."
      );
    }

    // =========================
    // CRIA O QUOTE
    // =========================

    const image = await createQuote({
      avatarUrl: quotedMessage.author.displayAvatarURL({
        extension: "png",
        size: 512
      }),

      text: quotedMessage.content,

      username: quotedMessage.author.username,

      displayName: quotedMessage.author.displayName
    });

    // =========================
    // ENVIA NO CANAL CONFIGURADO
    // =========================

    await quoteChannel.send({
      files: [
        {
          attachment: image,
          name: "quote.png"
        }
      ]
    });

    // =========================
    // CONFIRMA NO CANAL ATUAL
    // =========================

    await message.reply(
      `✅ Quote enviado para ${quoteChannel}.`
    );
  }
};
