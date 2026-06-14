const { EmbedBuilder } = require("discord.js");
const { loadDB, saveDB, getUser } = require("../../economy");

function formatMoney(value) {
  const num = BigInt(value);

  const units = [
    { value: 1000000000000000000n, suffix: "Qi" },
    { value: 1000000000000000n, suffix: "Qa" },
    { value: 1000000000000n, suffix: "T" },
    { value: 1000000000n, suffix: "B" },
    { value: 1000000n, suffix: "M" },
    { value: 1000n, suffix: "K" }
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const whole = num / unit.value;
      const decimal = (num % unit.value) * 100n / unit.value;

      return `${whole}.${decimal.toString().padStart(2, "0")}${unit.suffix}`;
    }
  }

  return num.toString();
}

module.exports = {
  name: "dep",

  async execute(message, args) {

    const jailedUntil = global.jail.get(message.author.id);

    if (jailedUntil && jailedUntil > Date.now()) {
      return message.reply(
        "🚨 Você está preso e não pode usar economia!"
      );
    }

    const amount = args[0];

    if (!amount) {
      return message.reply(
        "❌ Use: `mizuidep <quantidade>` ou `mizuidep all`"
      );
    }

    const db = loadDB();

    getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL({
        dynamic: true
      })
    );

    const db = loadDB();

const dbUser = ensureUser(
  db,
  message.author.id,
  message.author.username,
  message.author.displayAvatarURL({ extension: "png" })
);

    const wallet = BigInt(dbUser.coins || 0);
    const bank = BigInt(dbUser.bank || 0);

    let depositAmount;

    if (amount.toLowerCase() === "all") {

      depositAmount = wallet;

    } else {

      if (!/^\d+$/.test(amount)) {
  return message.reply("❌ Digite apenas números ou 'all'.");
}

depositAmount = BigInt(amount);

      if (depositAmount <= 0n) {
        return message.reply(
          "❌ Digite uma quantidade válida."
        );
      }
    }

    if (depositAmount > wallet) {
      return message.reply(
        "❌ Você não possui essa quantidade na carteira."
      );
    }

    dbUser.coins = (
      wallet - depositAmount
    ).toString();

    dbUser.bank = (
      bank + depositAmount
    ).toString();

    saveDB(db);

    const embed = new EmbedBuilder()
      .setColor(
        global.getEmbedColor(
          message.guild.id
        )
      )
      .setTitle("🏦 Depósito Realizado")
      .setThumbnail(
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .addFields(
        {
          name: "💸 Depositado",
          value: `${formatMoney(depositAmount)} MZCoins`,
          inline: true
        },
        {
          name: "👛 Carteira",
          value: `${formatMoney(dbUser.coins)} MZCoins`,
          inline: true
        },
        {
          name: "🏦 Banco",
          value: `${formatMoney(dbUser.bank)} MZCoins`,
          inline: true
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};
