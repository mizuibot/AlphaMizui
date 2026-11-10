
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { products, getUserItems } = require("../utils/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("iv")
    .setDescription("Veja seu inventário"),

  async execute(interaction) {
    const inventory = getUserItems(interaction.user.id);

    if (inventory.length === 0) {
      return interaction.reply({
        content: "📦 Seu inventário está vazio!",
        ephemeral: true
      });
    }

    const items = inventory
      .map(id => products.find(product => product.id === id))
      .filter(Boolean);

    const description = items
      .map((item, index) =>
        `**${index + 1}. ${item.name}**\n` +
        `💰 ${item.price.toLocaleString("pt-BR")} MZCoins`
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`🎒 Inventário de ${interaction.user.username}`)
      .setDescription(description)
      .setFooter({
        text: `Produtos: ${items.length}/12`
      })
      .setColor(global.getEmbedColor(interaction.guild.id));

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};

