const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "memory",

  async execute(message) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão.");
    }

    const mem = process.memoryUsage();

    const rss = (mem.rss / 1024 / 1024).toFixed(2);
    const heapUsed = (mem.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (mem.heapTotal / 1024 / 1024).toFixed(2);
    const external = (mem.external / 1024 / 1024).toFixed(2);

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle("🖥️ Status da Mizui")
      .setColor(global.getEmbedColor(message.guild.id))
      .addFields(
        {
          name: "📦 RSS",
          value: `${rss} MB`,
          inline: true
        },
        {
          name: "🧠 Heap",
          value: `${heapUsed}/${heapTotal} MB`,
          inline: true
        },
        {
          name: "📁 External",
          value: `${external} MB`,
          inline: true
        },
        {
          name: "⏱️ Uptime",
          value: `${hours}h ${minutes}m ${seconds}s`,
          inline: true
        },
        {
          name: "🟢 Node",
          value: process.version,
          inline: true
        },
        {
          name: "📡 Ping",
          value: `${message.client.ws.ping} ms`,
          inline: true
        }
      );

    return message.reply({ embeds: [embed] });
  },
};
