const { EmbedBuilder } = require("discord.js");

const {
  addCoins,
  canUse,
  getUser
} = require("../../economy");

module.exports = {
  name: "work",

  async execute(message) {
    try {

      const jailedUntil =
        global.jail?.get(message.author.id);

      if (
        jailedUntil &&
        jailedUntil > Date.now()
      ) {
        return message.reply(
          "🚨 Você está preso e não pode usar economia!"
        );
      }

      const result = canUse(
        message.author.id,
        "work",
        2 * 60 * 60 * 1000
      );

      if (!result.ok) {
        const minutes = Math.ceil(
          result.remaining / 60000
        );

        return message.reply(
          `⏳ Você ainda não pode trabalhar.\n\nTempo restante: **${minutes} minuto(s)**`
        );
      }

      const user = getUser(
        message.author.id,
        message.author.username,
        message.author.displayAvatarURL()
      );

      const wallet =
        BigInt(user?.coins || "0");

      const bank =
        BigInt(user?.bank || "0");

      const balance =
        wallet + bank;

      let reward =
        (balance / 1000n) +
        BigInt(
          Math.floor(
            Math.random() * 10000
          )
        );

      if (reward < 100n)
        reward = 100n;

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
            `Você trabalhou e recebeu **${reward.toLocaleString("pt-BR")} MZCoins**.`
          )
          .addFields({
            name: "💰 Saldo Considerado",
            value:
              `${balance.toLocaleString("pt-BR")} MZCoins`,
            inline: true
          })
          .setThumbnail(
            message.author.displayAvatarURL({
              dynamic: true
            })
          )
          .setTimestamp();

      return message.reply({
        embeds: [embed]
      });

    } catch (err) {

      console.error(
        "[WORK ERROR]",
        message.author.id,
        err
      );

      return message.reply(
        "❌ Ocorreu um erro ao executar o comando."
      );
    }
  }
};
