const { EmbedBuilder } = require("discord.js");
const { addCoins, canUse } = require("../../economy");

module.exports = {
name: "mine",

async execute(message) {

const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

const cooldown = canUse(
  message.author.id,
  "mine",
  20 * 1000
);

if (!cooldown.ok) {
  const sec = Math.ceil(cooldown.remaining / 1000);

  return message.reply(
    `⛏️ Aguarde **${sec}s** para minerar novamente.`
  );
}

const roll = Math.random() * 100;

let result = "";
let reward = 0;

// ⛏️ Ferro
if (roll <= 25) {
  reward = 1000;
  addCoins(message.author.id, reward);

  result =
    `⛏️ Você minerou **Ferro** e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 🟡 Ouro
else if (roll <= 50) {
  reward = 2500;
  addCoins(message.author.id, reward);

  result =
    `🟡 Você encontrou **Ouro** e ganhou **${reward.toLocaleString()} mzcoins**`;
}

// 🔴 Rubi
else if (roll <= 70) {
  reward = 5000;
  addCoins(message.author.id, reward);

  result =
    `🔴 Você achou **Rubi raro** e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 💎 Diamante
else if (roll <= 85) {
  reward = 10000;
  addCoins(message.author.id, reward);

  result =
    `💎 Você minerou **Diamante** e ganhou **${reward.toLocaleString()} mzcoins**`;
}

// 🟢 Esmeralda
else if (roll <= 95) {
  reward = 25000;
  addCoins(message.author.id, reward);

  result =
    `🟢 Você encontrou **Esmeralda lendária** e ganhou **${reward.toLocaleString()} mzcoins**`;
}

// 👑 Minério Mítico
else {
  reward = 100000;
  addCoins(message.author.id, reward);

  result =
    `👑 JACKPOT! Você encontrou um **Minério Mítico** e ganhou **${reward.toLocaleString()} mzcoins**`;
}

const embed = new EmbedBuilder()
  .setTitle("⛏️ Mizui Mining")
  .setDescription(result)
  .setColor(
    global.getEmbedColor(
      message.guild.id
    )
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