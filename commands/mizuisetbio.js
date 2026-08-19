const { SlashCommandBuilder } = require("discord.js");
const { loadDB, saveDB } = require("../economy")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setbio")
    .setDescription("Altera a bio do seu perfil.")
    .addStringOption(option =>
      option
        .setName("texto")
        .setDescription("Escreva sua nova bio.")
        .setRequired(true)
    ),

  async execute(interaction) {
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

    const bio = interaction.options.getString("texto").trim();

    db[interaction.user.id].bio = bio;

    saveDB(db);

    return interaction.reply("✅ Bio atualizada com sucesso!");
  }
};
