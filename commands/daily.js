const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const FILE = "./economy.json";

function loadDB() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveDB(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Pegue seu reward diário"),

  async execute(interaction) {
    const db = loadDB();

    const user = db.users?.[interaction.user.id];

    if (!user) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff4fd8")
            .setDescription("Você ainda não está no sistema.")
        ],
        ephemeral: true
      });
    }

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (now - (user.daily || 0) < cooldown) {
      const rest = cooldown - (now - (user.daily || 0));
      const h = Math.floor(rest / 3600000);
      const m = Math.floor((rest % 3600000) / 60000);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff4fd8")
            .setTitle("⏳ Daily em cooldown")
            .setDescription(`Volte em **${h}h ${m}m**`)
        ],
        ephemeral: true
      });
    }

    const reward = 500;

    user.coins = (
      BigInt(user.coins || "0") + BigInt(reward)
    ).toString();

    user.daily = now;

    saveDB(db);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(global.getEmbedColor(interaction.guild.id))
          .setTitle("💸 Daily coletado")
          .setDescription(
            `Você recebeu **${reward} coins**!\n💰 Total: **${user.coins}**`
          )
      ]
    });
  }
};
