const { EmbedBuilder } = require("discord.js");
const { addCoins, canUse } = require("../../economy");

module.exports = {
name: "fish",

async execute(message) {

const jailedUntil = global.jail.get(message.author.id);

if (jailedUntil && jailedUntil > Date.now()) {
  return message.reply("🚨 Você está preso e não pode usar economia!");
}

const cooldown = canUse(
  message.author.id,
  "fish",
  10 * 1000 // 10 segundos
);

if (!cooldown.ok) {
  const sec = Math.ceil(cooldown.remaining / 1000);

  return message.reply(
    `🎣 Aguarde **${sec}s** para pescar novamente.`
  );
}

const roll = Math.random() * 100;

let resultText = "";
let reward = 0;

// 🐟 Pequeno
if (roll <= 25) {
  reward = 1000;
  addCoins(message.author.id, reward);

  resultText =
    `🐟 Você pescou um peixe pequeno e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 🐠 Normal
else if (roll <= 50) {
  reward = 2500;
  addCoins(message.author.id, reward);

  resultText =
    `🐠 Você pescou um peixe normal e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// ⚔️ Espada
else if (roll <= 70) {
  reward = 5000;
  addCoins(message.author.id, reward);

  resultText =
    `⚔️ Você pescou um peixe espada e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 🦈 Martelo
else if (roll <= 85) {
  reward = 10000;
  addCoins(message.author.id, reward);

  resultText =
    `🦈 Você pescou um tubarão martelo e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 🦈 Tigre
else if (roll <= 95) {
  reward = 25000;
  addCoins(message.author.id, reward);

  resultText =
    `🦈 Você pescou um tubarão tigre e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

// 👑 Branco
else {
  reward = 100000;
  addCoins(message.author.id, reward);

  resultText =
    `👑 BOSS! Você pescou um tubarão branco e vendeu por **${reward.toLocaleString()} mzcoins**`;
}

const embed = new EmbedBuilder()
  .setTitle("🎣 Mizui Fishing")
  .setDescription(resultText)
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