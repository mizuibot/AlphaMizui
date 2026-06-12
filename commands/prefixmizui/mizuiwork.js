const { EmbedBuilder } = require("discord.js");
const {
  addCoins,
  canUse,
  formatTime,
  getUser
} = require("../../economy");
module.exports = {
  name: "work",

  async execute(message) {

   const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

    const result = canUse(
      message.author.id,
      "work",
      2 * 60 * 60 * 1000
    );

    if (!result.ok) {
      return message.reply(
        `⏳ Você ainda não pode trabalhar.\n\nTempo restante: **${formatTime(result.remaining)}**`
      );
    }

    const user = getUser(message.author.id);

const balance =
BigInt(user.coins) +
BigInt(user.bank);

let reward =
(balance / 1000n) +
BigInt(Math.floor(Math.random() * 10000));

if (reward > 50000n)
  reward = 50000n;


    addCoins(
      message.author.id,
      reward
    );

    const embed =
      new EmbedBuilder()
        .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
        .setTitle("💼 Trabalho")
        .setDescription(
          `Você trabalhou e recebeu **${reward} MZCoins**.`
        )
        .setThumbnail(
          message.author.displayAvatarURL({
            dynamic: true
          })
        )
        .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};