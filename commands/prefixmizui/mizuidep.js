const { EmbedBuilder } = require("discord.js");
const { loadDB, saveDB, getUser } = require("../../economy");

module.exports = {
  name: "dep",

  async execute(message, args) {

    const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

    const amount = args[0];

    if (!amount) {
      return message.reply(
        "❌ Use: `mizuidep <quantidade>` ou `mizuidep all`"
      );
    }

    const db = loadDB();

    const user = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL({
        dynamic: true
      })
    );

    const dbUser = db.users[message.author.id];

    const wallet = BigInt(dbUser.coins || 0);
    const bank = BigInt(dbUser.bank || 0);

    let depositAmount;

    if (amount.toLowerCase() === "all") {

      depositAmount = wallet;

    } else {

      try {
        depositAmount = BigInt(amount);
      } catch {
        return message.reply(
          "❌ Digite uma quantidade válida."
        );
      }

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

    dbUser.coins =
      (wallet - depositAmount).toString();

    dbUser.bank =
      (bank + depositAmount).toString();

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
          value: `${depositAmount.toString()} MZCoins`,
          inline: true
        },
        {
          name: "👛 Carteira",
          value: `${dbUser.coins} MZCoins`,
          inline: true
        },
        {
          name: "🏦 Banco",
          value: `${dbUser.bank} MZCoins`,
          inline: true
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};