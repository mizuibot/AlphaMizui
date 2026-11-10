
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { products } = require("../utils/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Veja os produtos da loja do Flamengo"),

  async execute(interaction) {
    const color = global.getEmbedColor(interaction.guild.id);

    const embeds = products.map((product, index) =>
      new EmbedBuilder()
        .setTitle(`${index + 1}. ${product.name}`)
        .setDescription(
          `💰 **${product.price.toLocaleString("pt-BR")} MZCoins**\n` +
          `🆔 ID: \`${product.id}\``
        )
        .setImage(product.image)
        .setColor(color)
    );

    await interaction.reply({
      embeds: embeds.slice(0, 10)
    });

    if (embeds.length > 10) {
      await interaction.followUp({
        embeds: embeds.slice(10)
      });
    }
  }
};

