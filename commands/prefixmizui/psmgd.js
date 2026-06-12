const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "psmgd",

  async execute(message) {

    const stats = JSON.parse(
      fs.readFileSync("./stats.json", "utf8")
    );

    const guildData = stats[message.guild.id];

    if (!guildData) {
      return message.reply("Nenhum dado encontrado nesse servidor.");
    }

    const sorted = Object.entries(guildData)
      .sort((a, b) => {
        const aTotal = a[1].total || 0;
        const bTotal = b[1].total || 0;

        return bTotal - aTotal;
      })
      .slice(0, 10);

    if (sorted.length === 0) {
      return message.reply("Ninguém enviou mensagens aqui ainda.");
    }

    let text = "";

    sorted.forEach(([id, data], i) => {
      text += `**${i + 1}.** <@${id}>\n💬 ${data.total || 0} mensagens\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`🏰 Top 10 Mensagens • ${message.guild.name}`)
      .setDescription(text)
      .setColor(global.getEmbedColor(message.guild.id))
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};