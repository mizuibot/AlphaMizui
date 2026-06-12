const {
  EmbedBuilder
} = require("discord.js");

const marriages =
  require("../../marriages.json");

const loveSystem =
  require("../../marriagesLove");

console.log(loveSystem);

module.exports = {
  name: "love",

  async execute(message) {

    const married =
      marriages[message.author.id];

    if (
      !married ||
      !Array.isArray(married) ||
      married.length === 0
    ) {
      return message.reply(
        "💔 Você não está casado."
      );
    }

    const partnerId = married[0];

    const loveData =
  loveSystem.getLove(
    message.author.id,
    partnerId
  );

    const days =
      Math.floor(
        (
          Date.now() -
          loveData.marriedSince
        ) / 86400000
      );

    const frases = [

      "💕 O amor é construído todos os dias.",

      "🌙 Pequenos gestos mantêm grandes amores vivos.",

      "💜 Quem ama cuida.",

      "✨ O amor não cresce sozinho.",

      "🫂 Todo relacionamento precisa de atenção.",

      "💞 Amar também é escolher permanecer.",

      "🌹 O amor floresce quando é cultivado.",

      "💖 Um abraço vale mais que mil palavras.",

      "💕 O carinho de hoje mantém o amor de amanhã.",

      "🌟 O amor vive nos detalhes."
    ];

    const frase =
      frases[
        Math.floor(
          Math.random() *
          frases.length
        )
      ];

    let status = "💚 Excelente";

    if (loveData.love <= 80)
      status = "💛 Estável";

    if (loveData.love <= 60)
      status = "🧡 Atenção";

    if (loveData.love <= 40)
      status = "❤️ Crítico";

    if (loveData.love <= 20)
      status = "💔 Quase Acabando";

    const embed =
      new EmbedBuilder()

        .setColor(
          global.getEmbedColor(
            message.guild.id
          )
        )

        .setTitle(
          "💕 Love Status"
        )

        .setDescription(
          `❤️ Casado com <@${partnerId}>`
        )

        .addFields(

          {
            name:
              "💖 LovePoints",
            value:
              `${loveData.love}/100`,
            inline: true
          },

          {
            name:
              "📅 Casamento",
            value:
              `${days} dias`,
            inline: true
          },

          {
            name:
              "📊 Status",
            value:
              status,
            inline: true
          },

          {
            name:
              "🤝 Apertos de Mão",
            value:
              `${loveData.handshake || 0}`,
            inline: true
          },

          {
            name:
              "🫳 Cafunés",
            value:
              `${loveData.patpat || 0}`,
            inline: true
          },

          {
            name:
              "🫂 Abraços",
            value:
              `${loveData.hug || 0}`,
            inline: true
          },

          {
            name:
              "💋 Beijos",
            value:
              `${loveData.kiss || 0}`,
            inline: true
          },

          {
            name:
              "🌹 Mensagem",
            value:
              frase
          }
        )

        .setFooter({
          text:
            "Cuide do amor antes que ele desapareça."
        })

        .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};