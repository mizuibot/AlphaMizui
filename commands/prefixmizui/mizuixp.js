const {
EmbedBuilder
} = require("discord.js");

const fs =
require("fs");

const xpData =
require("../../xp.json");

module.exports = {

name: "xp",

async execute(message) {

const userId =
  message.author.id;

if (
  !xpData[userId]
) {

  xpData[userId] = {

    xp: 0,

    level: 1,

    prestige: 0,

    streak: 0,

    messages: 0,

    voiceMinutes: 0,

    commandsUsed: 0,

    class: "none",

    lastMessage: 0,

    lastDaily: 0
  };

  fs.writeFileSync(
    "./xp.json",

    JSON.stringify(
      xpData,
      null,
      2
    )
  );
}

const user =
  xpData[userId];

const nextLevel =
  Math.floor(
    100 *
    user.level *
    1.15
  );

const progress =
  (
    user.xp /
    nextLevel
  ) * 100;

const embed =
  new EmbedBuilder()

  .setColor(
    global.getEmbedColor(
      message.guild.id
    )
  )

  .setTitle(
    "🌟 Perfil de XP"
  )

  .setThumbnail(
    message.author
    .displayAvatarURL()
  )

  .setDescription(
    `Confira seu progresso de XP.`
  )

  .addFields(

    {
      name:
      "📈 Nível",

      value:
      `${user.level}`,

      inline: true
    },

    {
      name:
      "✨ XP",

      value:
      `${user.xp}/${nextLevel}`,

      inline: true
    },

    {
      name:
      "📊 Progresso",

      value:
      `${progress.toFixed(1)}%`,

      inline: true
    },

    {
      name:
      "🔥 Streak",

      value:
      `${user.streak} dias`,

      inline: true
    },

    {
      name:
      "🏆 Prestígio",

      value:
      `${user.prestige}`,

      inline: true
    },

    {
      name:
      "🎭 Classe",

      value:
      `${user.class}`,

      inline: true
    },

    {
      name:
      "💬 Mensagens",

      value:
      `${user.messages}`,

      inline: true
    },

    {
      name:
      "🎙️ Voz",

      value:
      `${user.voiceMinutes} min`,

      inline: true
    },

    {
      name:
      "🤖 Comandos",

      value:
      `${user.commandsUsed}`,

      inline: true
    }

  )

  .setFooter({
    text:
    "Continue usando a Mizui para ganhar XP!"
  });

return message.reply({
  embeds: [embed]
});

}
};
