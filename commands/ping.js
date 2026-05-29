const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mostra o ping da bot"),

  async execute(interaction, client) {
    try {
      console.log("PING EXECUTANDO");

      const sent = await interaction.reply({
        content: "Calculando ping...",
        fetchReply: true,
      });

      const apiPing = client.ws.ping;
      const latency = sent.createdTimestamp - interaction.createdTimestamp;

      console.log("LATÊNCIA:", latency);
      console.log("API:", apiPing);

      return await interaction.editReply(
        `🏓 Pong!\n⏱️ ${latency}ms\n📡 API: ${apiPing}ms`
      );

    } catch (err) {
      console.log("ERRO NO PING:", err);
    }
  },
};