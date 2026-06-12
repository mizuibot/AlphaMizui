const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  addCoins,
  canUse,
  getUser,
  removeCoins
} = require("../economy");

const jail = global.jail;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuicrime")
    .setDescription("Tente cometer crimes e ganhar mzcoins!")
    .addStringOption(option =>
      option
        .setName("acao")
        .setDescription("Escolha o crime")
        .setRequired(true)
        .addChoices(
          { name: "📱 Celular", value: "celular" },
          { name: "🚗 Carro", value: "carro" },
          { name: "🏠 Casa", value: "casa" },
          { name: "🏦 Banco", value: "banco" }
        )
    ),

  async execute(interaction) {

    const userId = interaction.user.id;
    const choice = interaction.options.getString("acao");

    const jailed = global.jail.get(userId);

    if (jailed && jailed.until > Date.now()) {

      const remaining = jailed.until - Date.now();
      const min = Math.floor(remaining / 60000);
      const sec = Math.floor((remaining % 60000) / 1000);

      return interaction.reply({
        content:
          `🚨 VOCÊ ESTÁ PRESO!\n` +
          `⏳ Tempo restante: **${min}m ${sec}s**\n` +
          `💸 Fiança: **${jailed.fine.toLocaleString("pt-BR")} mzcoins**`,
        ephemeral: true
      });
    }

    if (jailed && jailed.until <= Date.now()) {
      global.jail.delete(userId);
    }

    const cooldownTime =
      choice === "banco"
        ? 3 * 60 * 60 * 1000
        : 10 * 60 * 1000;

    const cooldown = canUse(
      userId,
      `crime_${choice}`,
      cooldownTime
    );

    if (!cooldown.ok) {

      const min = Math.ceil(
        cooldown.remaining / 60000
      );

      return interaction.reply({
        content:
          `🚔 Aguarde **${min} minutos** para tentar esse crime novamente.`,
        ephemeral: true
      });
    }

    const roll = Math.random() * 100;

    let reward = 0;
    let resultText = "";

    // 📱 CELULAR
    if (choice === "celular") {

      if (roll <= 65) {

        reward =
          Math.floor(Math.random() * 500) + 300;

        addCoins(userId, reward);

        resultText =
          `📱 Você roubou um celular e ganhou **${reward} mzcoins**`;
      }

      else if (roll <= 95) {

        resultText =
          `❌ Você falhou e não conseguiu nada.`;
      }

      else {

        resultText =
          `🚨 Você foi quase preso tentando roubar um celular!`;
      }
    }

    // 🚗 CARRO
    else if (choice === "carro") {

      if (roll <= 43) {

        reward =
          Math.floor(Math.random() * 1700) + 800;

        addCoins(userId, reward);

        resultText =
          `🚗 Você roubou um carro e ganhou **${reward} mzcoins**`;
      }

      else if (roll <= 90) {

        const user = getUser(userId);

        const balance =
          Number(user.coins || 0);

        const penalty =
          Math.floor(balance * 0.10);

        if (penalty > 0) {
          removeCoins(userId, penalty);
        }

        resultText =
          `❌ Você falhou e saiu sem nada.\n` +
          `💸 Perdeu **${penalty.toLocaleString("pt-BR")} mzcoins** (10% do saldo).`;
      }

      else {

        resultText =
          `🚨 Você foi quase preso tentando roubar um carro!`;
      }
    }

    // 🏠 CASA
    else if (choice === "casa") {

      if (roll <= 28) {

        reward =
          Math.floor(Math.random() * 5000) + 3000;

        addCoins(userId, reward);

        resultText =
          `🏠 Você roubou uma casa e ganhou **${reward} mzcoins**`;
      }

      else if (roll <= 85) {

        const user = getUser(userId);

        const balance =
          Number(user.coins || 0);

        const penalty =
          Math.floor(balance * 0.10);

        if (penalty > 0) {
          removeCoins(userId, penalty);
        }

        resultText =
          `❌ Você não conseguiu levar nada da casa.\n` +
          `💸 Perdeu **${penalty.toLocaleString("pt-BR")} mzcoins** (10% do saldo).`;
      }

      else {

        resultText =
          `🚨 Você foi quase preso tentando roubar uma casa!`;
      }
    }

    // 🏦 BANCO
    else if (choice === "banco") {

      if (roll <= 12) {

        reward =
          Math.floor(Math.random() * 22000) + 8000;

        addCoins(userId, reward);

        resultText =
          `🏦 ASSALTO PERFEITO!\n` +
          `Você roubou o banco e ganhou **${reward} mzcoins**`;
      }

      else if (roll <= 72) {

        global.jail.set(userId, {
          until: Date.now() + 45 * 60 * 1000,
          fine: 345000
        });

        resultText =
          `🚨 VOCÊ FOI PRESO NO BANCO!\n\n` +
          `⛓️ Pena: **45 minutos**\n` +
          `💸 Fiança: **345.000 mzcoins**\n` +
          `❌ Você não pode usar comandos de economia`;
      }

      else {

        resultText =
          `❌ Você fugiu sem conseguir roubar nada do banco.`;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🚔 Mizui Crime System")
      .setDescription(resultText)
      .setColor(
        global.getEmbedColor(interaction.guild.id)
      )
      .setTimestamp();

    return interaction.reply({
      embeds: [embed]
    });
  }
};