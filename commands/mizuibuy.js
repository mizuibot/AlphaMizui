
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { removeCoins } = require("../economy");
const { products, getUserItems, addUserItem } = require("../utils/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Compre um produto da loja")
    .addStringOption(option =>
      option
        .setName("produto")
        .setDescription("Escolha o produto")
        .setRequired(true)
        .addChoices(
          ...products.map(product => ({
            name: product.name,
            value: product.id
          }))
        )
    ),

  async execute(interaction) {
    const itemId = interaction.options.getString("produto");
    const product = products.find(p => p.id === itemId);

    if (!product) {
      return interaction.reply({
        content: "❌ Produto não encontrado.",
        ephemeral: true
      });
    }

    const userId = interaction.user.id;

    if (getUserItems(userId).includes(itemId)) {
      return interaction.reply({
        content: "❌ Você já possui esse produto!",
        ephemeral: true
      });
    }

    const success = removeCoins(userId, product.price);

    if (!success) {
      return interaction.reply({
        content: `❌ MZCoins insuficientes! Preço: **${product.price.toLocaleString("pt-BR")} MZCoins**`,
        ephemeral: true
      });
    }

    const added = addUserItem(userId, itemId);

    if (!added) {
      return interaction.reply({
        content: "❌ Você já possui esse produto!",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🛍️ Compra realizada!")
      .setDescription(
        `Você comprou **${product.name}**!\n\n` +
        `💰 Valor: **${product.price.toLocaleString("pt-BR")} MZCoins**`
      )
      .setImage(product.image)
      .setColor(global.getEmbedColor(interaction.guild.id));

    return interaction.reply({ embeds: [embed] });
  }
};

