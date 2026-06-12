const { EmbedBuilder } = require("discord.js");
const { addCoins, canUse } = require("../../economy");

module.exports = {
  name: "beg",

  async execute(message, args) {

    const cooldown = canUse(
      message.author.id,
      "beg",
      15 * 1000 // 15 segundos (ajusta se quiser)
    );

    const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

    if (!cooldown.ok) {
      const sec = Math.ceil(cooldown.remaining / 1000);
      return message.reply(`🙏 Aguarde **${sec}s** para pedir esmola novamente.`);
    }

    // 💰 valor aleatório
    const amount = Math.floor(Math.random() * (750 - 50 + 1)) + 50;

    addCoins(message.author.id, amount);

    const embed = new EmbedBuilder()
      .setTitle("🙏 Mizui Beg")
      .setDescription(
        `Você pediu ajuda e ganhou **${amount} mzcoins** 💰`
      )
      .setColor(global.getEmbedColor(message.guild.id));

    return message.reply({ embeds: [embed] });
  }
};