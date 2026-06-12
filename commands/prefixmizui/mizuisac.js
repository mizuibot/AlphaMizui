const {
  EmbedBuilder
} = require("discord.js");

const {
  withdrawCoins,
  getUser
} = require("../../economy");

module.exports = {
  name: "sacar",

  async execute(message, args) {

const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

    let amount;

try {
  amount = BigInt(args[0]);

  if (amount <= 0n) {
    return message.reply(
      "❌ Informe uma quantidade válida."
    );
  }

} catch {
  return message.reply(
    "❌ Valor inválido."
  );
}

console.log("=== MIZUIWITH ===");
console.log("User:", message.author.id);
console.log("Args:", args);
console.log("Amount:", amount);

    const before = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL()
    );

    console.log("ANTES:");
    console.log("Coins:", before.coins);
    console.log("Bank:", before.bank);

    const success = withdrawCoins(
      message.author.id,
      amount
    );

    console.log("Withdraw result:", success);

    if (!success) {
      return message.reply(
        `❌ Você não possui ${amount} MZCoins no banco.\n\n🏦 Banco atual: ${before.bank}`
      );
    }

    const user = getUser(
      message.author.id,
      message.author.username,
      message.author.displayAvatarURL()
    );

    console.log("DEPOIS:");
    console.log("Coins:", user.coins);
    console.log("Bank:", user.bank);

    const embed = new EmbedBuilder()
      .setTitle("🏦 Saque realizado")
      .setColor(
  global.getEmbedColor(
    message.guild.id
  )
)
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        `Você sacou **${amount.toLocaleString()} MZCoins** do banco.`
      )
      .addFields(
        {
          name: "💰 Carteira",
          value: `${user.coins.toLocaleString()} MZCoins`,
          inline: true
        },
        {
          name: "🏦 Banco",
          value: `${user.bank.toLocaleString()} MZCoins`,
          inline: true
        }
      )
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};