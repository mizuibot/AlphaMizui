const {
  addCoins,
  removeCoins,
  getUser,
  canUse
} = require("../../economy");

module.exports = {
  name: "roubar",

  async execute(message, args) {

    const jailedUntil = global.jail.get(message.author.id);

    if (jailedUntil && jailedUntil > Date.now()) {
      return message.reply(
        "🚨 Você está preso e não pode usar economia!"
      );
    }

    const target =
      message.mentions.users.first();

    if (!target) {
      return message.reply(
        "👤 Marque alguém para roubar."
      );
    }

    if (target.id === message.author.id) {
      return message.reply(
        "🤡 Você não pode roubar você mesmo."
      );
    }

    const cooldown = canUse(
      message.author.id,
      "rob",
      5 * 60 * 1000
    );

    if (!cooldown.ok) {

      const sec = Math.ceil(
        cooldown.remaining / 1000
      );

      const min = Math.floor(sec / 60);

      const seconds = sec % 60;

      return message.reply(
        `🚔 Você está cansado!\n⏳ Tente novamente em **${min}m ${seconds}s**`
      );
    }

    // Saldo do alvo
    const targetData =
      getUser(target.id);

    const targetBalance =
      Number(targetData?.coins || 0);

    // O alvo não tem dinheiro
    if (targetBalance <= 0) {
      return message.reply(
        "💸 Essa pessoa não tem mzcoins para você roubar!"
      );
    }

    // 43% sucesso
    const success =
      Math.random() < 0.43;

    if (!success) {

      const userData =
        getUser(message.author.id);

      const balance =
        Number(userData?.coins || 0);

      // APENAS 10%
      const penalty =
        Math.floor(balance * 0.10);

      if (penalty > 0) {
        removeCoins(
          message.author.id,
          penalty
        );
      }

      return message.reply(
        `🚨 FALHA NO ROUBO!\n\n💸 Você perdeu **${penalty.toLocaleString()} mzcoins** (10% do seu saldo).\n\n❗ *O alvo chamou a polícia.*`
      );
    }

    // Máximo de 120.000,
    // mas nunca mais do que o alvo possui
    const maxAmount =
      Math.min(120000, targetBalance);

    const minAmount =
      Math.min(250, maxAmount);

    const amount =
      Math.floor(
        Math.random() *
        (maxAmount - minAmount + 1)
      ) + minAmount;

    // Tira do alvo
    removeCoins(
      target.id,
      amount
    );

    // Dá para quem roubou
    addCoins(
      message.author.id,
      amount
    );

    return message.reply(
      `💰 Você roubou **${amount.toLocaleString()} mzcoins** de <@${target.id}> 😈`
    );
  }
};
