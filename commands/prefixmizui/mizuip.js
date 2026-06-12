const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const STATS_FILE = path.join(__dirname, "../../stats.json");

function loadStats() {
  if (!fs.existsSync(STATS_FILE)) return {};
  return JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));
}

module.exports = {
  name: "p",

  async execute(message) {
    const stats = loadStats();
    const guildStats = stats[message.guild.id] || {};

    const ranking = Object.entries(guildStats)
      .map(([userId, data]) => ({
        userId,
        count: data?.today?.count || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const lines = [];

    for (let i = 0; i < ranking.length; i++) {
      const user = ranking[i];

      let username = "Usuário desconhecido";

      try {
        const member = await message.guild.members.fetch(user.userId);
        username = member.displayName;
      } catch {}

      lines.push(
        `**${i + 1}.** ${username} — ${user.count} msgs`
      );
    }

    const desc =
      lines.join("\n") ||
      "Sem dados hoje.";

    const embed = new EmbedBuilder()
      .setTitle("📊 Ranking Diário (Hoje)")
      .setDescription(desc)
      .setColor(0x8b5cf6)
      .setTimestamp();

    return message.reply({
      embeds: [embed]
    });
  }
};