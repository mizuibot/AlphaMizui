const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { file } = require("../storage");
const { getUser, removeCoins } = require("../economy");

const MARRIAGES_FILE = file("marriages.json");
const COOLDOWNS_FILE = file("marryCooldowns.json");

// =========================
// CASAMENTOS
// =========================

function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE)) return {};

  try {
    return JSON.parse(
      fs.readFileSync(MARRIAGES_FILE, "utf8")
    );
  } catch {
    return {};
  }
}

function saveMarriages(data) {
  fs.writeFileSync(
    MARRIAGES_FILE,
    JSON.stringify(data, null, 2)
  );
}

// =========================
// COOLDOWN DE CASAMENTO
// =========================

function loadCooldowns() {
  if (!fs.existsSync(COOLDOWNS_FILE)) return {};

  try {
    return JSON.parse(
      fs.readFileSync(COOLDOWNS_FILE, "utf8")
    );
  } catch {
    return {};
  }
}

function saveCooldowns(data) {
  fs.writeFileSync(
    COOLDOWNS_FILE,
    JSON.stringify(data, null, 2)
  );
}

// =========================
// COMANDO
// =========================

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuiexmarry")
    .setDescription("Divorciar de uma ou de todas as pessoas")
    .addUserOption(option =>
      option
        .setName("pessoa")
        .setDescription("Pessoa específica da qual você quer se divorciar")
        .setRequired(false)
    ),

  async execute(interaction) {

    const userId = interaction.user.id;

    const target =
      interaction.options.getUser("pessoa");

    const marriages = loadMarriages();

    const partners =
      marriages[userId] || [];

    // =========================
    // NÃO ESTÁ CASADO
    // =========================

    if (partners.length === 0) {
      return interaction.reply({
        content: "💔 Você não está casado com ninguém.",
        ephemeral: true
      });
    }

    // =========================
    // DIVÓRCIO DE UMA PESSOA
    // =========================

    if (target) {

      if (!partners.includes(target.id)) {
        return interaction.reply({
          content: `💔 Você não está casado com <@${target.id}>.`,
          ephemeral: true
        });
      }

    }

    // =========================
    // CONFIRMAÇÃO
    // =========================

    const isSingle =
      !!target;

    const targetText =
      isSingle
        ? `de <@${target.id}>`
        : "de **todos os seus parceiros**";

    const confirmButton =
      new ButtonBuilder()
        .setCustomId("confirm_divorce")
        .setLabel("Confirmar divórcio")
        .setEmoji("💔")
        .setStyle(ButtonStyle.Danger);

    const cancelButton =
      new ButtonBuilder()
        .setCustomId("cancel_divorce")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Secondary);

    const row =
      new ActionRowBuilder()
        .addComponents(
          confirmButton,
          cancelButton
        );

    const confirmMessage =
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("💔 Confirmar divórcio")
            .setDescription(
              `Você realmente deseja se divorciar ${targetText}?\n\n` +
              `💸 **Custo:** 15% do seu saldo\n` +
              `💔 Você ficará **1 dia sem poder se casar novamente**.\n\n` +
              `⚠️ **Apenas a sua confirmação é necessária.**`
            )
            .setColor(
              global.getEmbedColor(
                interaction.guild.id
              )
            )
        ],
        components: [row],
        ephemeral: true,
        fetchReply: true
      });

    // =========================
    // COLETOR
    // =========================

    const collector =
      confirmMessage.createMessageComponentCollector({
        filter: button =>
          button.user.id === userId,
        time: 30_000,
        max: 1
      });

    collector.on("collect", async button => {

      // =========================
      // CANCELAR
      // =========================

      if (button.customId === "cancel_divorce") {

        return button.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("💔 Divórcio cancelado")
              .setDescription(
                "Você não se divorciou de ninguém."
              )
              .setColor(
                global.getEmbedColor(
                  interaction.guild.id
                )
              )
          ],
          components: []
        });
      }

      // =========================
      // CONFIRMAR
      // =========================

      const currentMarriages =
        loadMarriages();

      const currentPartners =
        currentMarriages[userId] || [];

      if (currentPartners.length === 0) {
        return button.update({
          content: "💔 Você não está mais casado com ninguém.",
          embeds: [],
          components: []
        });
      }

      // =========================
      // DEFINIR QUEM SERÁ REMOVIDO
      // =========================

      let partnersToRemove;

      if (target) {

        // Divórcio de apenas uma pessoa
        partnersToRemove = [target.id];

      } else {

        // Divórcio de todos
        partnersToRemove = [...currentPartners];

      }

      // =========================
      // SALDO
      // =========================

      const userData =
        getUser(userId);

      const balance =
        Number(userData?.coins || 0);

      const penalty =
        Math.floor(balance * 0.15);

      if (penalty > 0) {
        removeCoins(
          userId,
          penalty
        );
      }

      // =========================
      // REMOVER CASAMENTOS
      // =========================

      for (const partnerId of partnersToRemove) {

        currentMarriages[partnerId] =
          (currentMarriages[partnerId] || [])
            .filter(id => id !== userId);

        if (
          currentMarriages[partnerId].length === 0
        ) {
          delete currentMarriages[partnerId];
        }
      }

      // Remove somente os selecionados
      currentMarriages[userId] =
        currentPartners.filter(
          id => !partnersToRemove.includes(id)
        );

      if (
        currentMarriages[userId].length === 0
      ) {
        delete currentMarriages[userId];
      }

      saveMarriages(currentMarriages);

      // =========================
      // COOLDOWN DE 1 DIA
      // =========================

      const cooldowns =
        loadCooldowns();

      cooldowns[userId] =
        Date.now() + (24 * 60 * 60 * 1000);

      saveCooldowns(cooldowns);

      // =========================
      // RESULTADO
      // =========================

      const divorceText =
        target
          ? `de <@${target.id}>`
          : "de todos";

      return button.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("💔 Divórcio realizado")
            .setDescription(
              `Você se divorciou ${divorceText}.\n\n` +
              `💸 **Taxa:** ${penalty.toLocaleString()} mzcoins (15% do saldo)\n` +
              `⏳ Você poderá se casar novamente em **1 dia**.`
            )
            .setColor(
              global.getEmbedColor(
                interaction.guild.id
              )
            )
        ],
        components: []
      });
    });

    // =========================
    // EXPIRADO
    // =========================

    collector.on("end", async collected => {

      if (collected.size > 0) return;

      try {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("⏰ Confirmação expirada")
              .setDescription(
                "O tempo para confirmar o divórcio acabou."
              )
              .setColor(
                global.getEmbedColor(
                  interaction.guild.id
                )
              )
          ],
          components: []
        });
      } catch {}
    });
  }
};
