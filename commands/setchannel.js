const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const CHANNEL_FILE = path.join(__dirname, "..", "channels.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Define o canal onde a Mizui pode responder")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal permitido")
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("canal");
    const guildId = interaction.guild.id;

    global.channels.set(guildId, channel.id);

    fs.writeFileSync(
      CHANNEL_FILE,
      JSON.stringify(Object.fromEntries(global.channels), null, 2)
    );

    return interaction.reply({
      content: `📍 Mizui agora responde apenas em: <#${channel.id}>`,
      ephemeral: true,
    });
  },
};