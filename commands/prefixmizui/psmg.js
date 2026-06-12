const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "psmg",

  async execute(message) {

    const stats = JSON.parse(
      fs.readFileSync("./stats.json", "utf8")
    );

    const allUsers = {};

    // 🔥 junta tudo globalmente
    for (const guildId of Object.keys(stats)) {
      for (const userId of Object.keys(stats[guildId])) {

        if (!allUsers[userId]) {
          allUsers[userId] = 0;
        }

        allUsers[userId] +=
          stats[guildId][userId].total || 0;
      }
    }

    const sorted = Object.entries(allUsers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (sorted.length === 0) {
      return message.reply("Ninguém enviou mensagens ainda.");
    }

    let text = "";

    sorted.forEach(([id, count], i) => {
      text += `**${i + 1}.** <@${id}>\n💬 ${count} mensagens\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🌍 Top 10 Mensagens Globais")
      .setDescription(text)
      .setColor(global.getEmbedColor(message.guild.id))
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};