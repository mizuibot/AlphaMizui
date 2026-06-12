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

// 43% sucesso
const success =
  Math.random() < 0.43;

const amount =
  Math.floor(
    Math.random() *
    (120000 - 250 + 1)
  ) + 250;

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

addCoins(
  message.author.id,
  amount
);

return message.reply(
  `💰 Você roubou **${amount.toLocaleString()} mzcoins** de <@${target.id}> 😈`
);

}
};