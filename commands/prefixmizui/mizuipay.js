const { EmbedBuilder } = require("discord.js");

const {
  loadDB,
  getUser,
  transferCoins
} = require("../../economy");

module.exports = {
  name: "pay",

  async execute(message, args) {

    const jailedUntil = global.jail?.get(message.author.id);

    if (jailedUntil && jailedUntil > Date.now()) {
      return message.reply(
        "🚨 Você está preso e não pode usar economia!"
      );
    }

    const target = message.mentions.users.first();

    if (!target) {
      return message.reply("❌ Mencione alguém.");
    }

    if (target.bot) {
      return message.reply(
        "❌ Você não pode enviar dinheiro para bots."
      );
    }

    if (target.id === message.author.id) {
      return message.reply(
        "❌ Você não pode pagar a si mesmo."
      );
    }

    if (!args[1]) {
      return message.reply(
        "❌ Use: `mizuipay @usuário quantidade`"
      );
    }

    let amount;

    try {
      amount = BigInt(args[1]);
    } catch {
      return message.reply(
        "❌ Valor inválido."
      );
    }

    if (amount <= 0n) {
      return message.reply(
        "❌ Valor inválido."
      );
    }

    getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL()
    );

    getUser(
      target.id,
      target.username,
      target.displayAvatarURL()
    );

    const success = transferCoins(
      message.author.id,
      target.id,
      amount
    );

    if (!success) {
      return message.reply(
        "❌ Você não possui saldo suficiente."
      );
    }

    const db = loadDB();

    const sender =
      db[message.author.id];

    const embed =
      new EmbedBuilder()
        .setColor(
          global.getEmbedColor(
            message.guild.id
          )
        )
        .setTitle("💸 Transferência")
        .setDescription(
          `Você enviou **${amount.toLocaleString("pt-BR")} MZCoins** para ${target}.`
        )
        .addFields({
          name: "💰 Carteira Atual",
          value: `${BigInt(
            sender.coins || "0"
          ).toLocaleString("pt-BR")} MZCoins`,
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
  }
};
