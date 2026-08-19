const { SlashCommandBuilder } = require("discord.js");
const { loadDB, saveDB } = require("../economy")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setbanner")
    .setDescription("Define uma imagem personalizada para o seu perfil.")
    .addAttachmentOption(option =>
      option
        .setName("imagem")
        .setDescription("Escolha a imagem para o seu banner.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const attachment = interaction.options.getAttachment("imagem");

    if (!attachment.contentType?.startsWith("image/")) {
      return interaction.reply({
        content: "❌ O arquivo precisa ser uma imagem.",
        ephemeral: true
      });
    }

    const db = loadDB();

    if (!db[interaction.user.id]) {
      db[interaction.user.id] = {
        coins: "0",
        bank: "0",
        work: 0,
        daily: 0,
        inventory: [],
        cooldowns: {},
        background: null,
        bio: "",
        customAvatar: null
      };
    }

    db[interaction.user.id].background = attachment.url;

    saveDB(db);

    return interaction.reply("✅ Banner salvo com sucesso!");
  }
};
