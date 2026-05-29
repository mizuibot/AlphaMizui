const { SlashCommandBuilder } = require("discord.js");

const items = [
  { name: "VIP Bronze", price: 500 },
  { name: "VIP Prata", price: 1500 },
  { name: "VIP Ouro", price: 3000 },
  { name: "Tag especial", price: 1000 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Ver a loja de mzcoins"),

  async execute(interaction) {
    const list = items
      .map(i => `🛒 **${i.name}** - ${i.price} mzcoins`)
      .join("\n");

    return interaction.reply({
      content: `🏪 **LOJA MZCOINS**\n\n${list}`
    });
  }
};