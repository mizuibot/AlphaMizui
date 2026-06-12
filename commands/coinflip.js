const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { canUse, getUser, addCoins } = require("../economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Jogue cara ou coroa com risco e streak")
    .addStringOption(option =>
      option
        .setName("escolha")
        .setDescription("Cara ou Coroa")
        .setRequired(true)
        .addChoices(
          { name: "Cara", value: "Cara" },
          { name: "Coroa", value: "Coroa" }
        )
    ),

  async execute(interaction) {

    const choice = interaction.options.getString("escolha");
    const result = Math.random() < 0.5 ? "Cara" : "Coroa";

    const user = getUser(
      interaction.user.id,
      interaction.user.username,
      interaction.user.displayAvatarURL()
    );

    const cooldown = canUse(
  interaction.user.id,
  "coinflip",
  10 * 1000
);

    if (!cooldown.ok) {
      const ms = cooldown.remaining;

      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);

      return interaction.reply({
        content: `⏳ Aguarde **${m}m ${s}s** para jogar novamente.`,
        ephemeral: true
      });
    }

    if (!user.coinflipStreak) user.coinflipStreak = 0;

    let description = `Você escolheu: **${choice}**\n`;
    description += `Resultado: **${result}**\n\n`;

    // ACERTOU
    if (choice === result) {

      user.coinflipStreak += 1;

      const reward = 350 * Math.pow(2, user.coinflipStreak - 1);

      addCoins(user.id, reward);

      description += `🎉 ACERTOU!\n🔥 Streak: **${user.coinflipStreak}**\n💰 Ganhou **${reward} mzcoins**`;

    } else {

      // ERROU = perde tudo
      user.coinflipStreak = 0;

      description += `💀 ERROU!\n❌ Você perdeu tudo e sua streak foi zerada`;
    }

    const embed = new EmbedBuilder()
      .setTitle("🪙 Coinflip Casino")
      .setDescription(description)
      .setColor(
  global.getEmbedColor(
    interaction.guild.id
  )
)

    return interaction.reply({ embeds: [embed] });
  }
};