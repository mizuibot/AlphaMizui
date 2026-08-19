const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { loadDB, saveDB } = require("../economy")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("selectquote")
    .setDescription("Seleciona o canal onde os quotes serão enviados.")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Escolha o canal para enviar os quotes.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const canal = interaction.options.getChannel("canal");

    const db = loadDB();

    if (!db[interaction.guild.id]) {
      db[interaction.guild.id] = {};
    }

    db[interaction.guild.id].quoteChannel = canal.id;

    saveDB(db);

    return interaction.reply(
      `✅ Canal de quote definido como ${canal}.`
    );
  }
};
