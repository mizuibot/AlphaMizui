const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { file } = require("../storage");

const MARRIAGES_FILE = file("marriages.json");
const LOVE_FILE = file("marriageLove.json");

function loadMarriages() {
  if (!fs.existsSync(MARRIAGES_FILE))
    return {};

  return JSON.parse(
    fs.readFileSync(
      MARRIAGES_FILE,
      "utf8"
    )
  );
}

function saveMarriages(data) {
  fs.writeFileSync(
    MARRIAGES_FILE,
    JSON.stringify(data, null, 2)
  );
}

function loadLove() {
  if (!fs.existsSync(LOVE_FILE)) {
    fs.writeFileSync(
      LOVE_FILE,
      JSON.stringify({}, null, 2)
    );
  }

  try {
    return JSON.parse(
      fs.readFileSync(
        LOVE_FILE,
        "utf8"
      )
    );
  } catch {
    return {};
  }
}

function saveLove(data) {
  fs.writeFileSync(
    LOVE_FILE,
    JSON.stringify(data, null, 2)
  );
}

function getPairId(userA, userB) {
  return [userA, userB]
    .sort()
    .join("_");
}

module.exports = {

  data: new SlashCommandBuilder()

    .setName("mizuimarry")
    .setDescription("Pedir alguém em casamento")

    .addUserOption(o =>
      o
        .setName("user")
        .setDescription("Usuário que você deseja pedir em casamento")
        .setRequired(true)
    ),

  async execute(interaction) {

    const userId = interaction.user.id;

    const target =
      interaction.options.getUser("user");

    // =====================
    // VALIDAÇÕES
    // =====================

    if (target.id === userId) {
      return interaction.reply({
        content:
          "❌ Você não pode casar consigo mesmo.",
        ephemeral: true
      });
    }

    if (target.bot) {
      return interaction.reply({
        content:
          "❌ Você não pode casar com bots.",
        ephemeral: true
      });
    }

    const marriages = loadMarriages();

    const userPartners =
      marriages[userId] || [];

    const targetPartners =
      marriages[target.id] || [];

    // =====================
    // JÁ CASADO COM ESSA PESSOA
    // =====================

    if (
      userPartners.includes(target.id)
    ) {
      return interaction.reply({
        content:
          `💍 Você já é casado com ${target}.`,
        ephemeral: true
      });
    }

    // =====================
    // USUÁRIO JÁ CASADO
    // =====================

    if (userPartners.length > 0) {
      return interaction.reply({
        content:
          "❌ Você já está casado com outra pessoa.",
        ephemeral: true
      });
    }

    // =====================
    // ALVO JÁ CASADO
    // =====================

    if (targetPartners.length > 0) {
      return interaction.reply({
        content:
          `❌ ${target} já está casado com outra pessoa.`,
        ephemeral: true
      });
    }

    // =====================
    // IDs DOS BOTÕES
    // =====================

    const acceptId =
      `marry_accept_${userId}_${target.id}`;

    const cancelId =
      `marry_cancel_${userId}_${target.id}`;

    // =====================
    // BOTÕES
    // =====================

    const acceptButton =
      new ButtonBuilder()
        .setCustomId(acceptId)
        .setLabel("Aceitar casamento")
        .setEmoji("💍")
        .setStyle(ButtonStyle.Success);

    const cancelButton =
      new ButtonBuilder()
        .setCustomId(cancelId)
        .setLabel("Recusar")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger);

    const row =
      new ActionRowBuilder()
        .addComponents(
          acceptButton,
          cancelButton
        );

    // =====================
    // MENSAGEM
    // =====================

    const confirmMessage =
      await interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor(
              global.getEmbedColor(
                interaction.guild.id
              )
            )

            .setTitle(
              "💍 Pedido de casamento"
            )

            .setDescription(
              `${interaction.user} está pedindo ${target} em casamento! 💕\n\n` +
              `💍 **Os dois precisam aceitar o casamento.**\n\n` +
              `❤️ ${interaction.user} — ⏳ Aguardando confirmação\n` +
              `❤️ ${target} — ⏳ Aguardando confirmação`
            )

            .setFooter({
              text:
                "O pedido expira em 30 segundos."
            })

        ],

        components: [row],

        fetchReply: true

      });

    // =====================
    // CONFIRMAÇÕES
    // =====================

    const confirmed = new Set();

    // =====================
    // COLETOR
    // =====================

    const collector =
      confirmMessage.createMessageComponentCollector({

        filter: button =>
          (
            button.user.id === userId ||
            button.user.id === target.id
          ) &&
          (
            button.customId === acceptId ||
            button.customId === cancelId
          ),

        time: 30_000

      });

    collector.on(
      "collect",
      async button => {

        const clickerId =
          button.user.id;

        // =====================
        // CANCELAR / RECUSAR
        // =====================

        if (
          button.customId === cancelId
        ) {

          collector.stop("cancelled");

          const cancelEmbed =
            new EmbedBuilder()

              .setColor(
                global.getEmbedColor(
                  interaction.guild.id
                )
              )

              .setTitle(
                "💔 Pedido de casamento recusado"
              )

              .setDescription(
                `${button.user} recusou o pedido de casamento de ${interaction.user}.`
              );

          return button.update({

            embeds: [cancelEmbed],

            components: []

          });

        }

        // =====================
        // JÁ CONFIRMOU
        // =====================

        if (
          confirmed.has(clickerId)
        ) {

          return button.reply({

            content:
              "💍 Você já confirmou o casamento!",

            ephemeral: true

          });

        }

        // =====================
        // CONFIRMAR
        // =====================

        confirmed.add(clickerId);

        // =====================
        // OS DOIS CONFIRMARAM
        // =====================

        if (
          confirmed.has(userId) &&
          confirmed.has(target.id)
        ) {

          collector.stop("married");

          const currentMarriages =
            loadMarriages();

          if (!currentMarriages[userId])
            currentMarriages[userId] = [];

          if (!currentMarriages[target.id])
            currentMarriages[target.id] = [];

          // =====================
          // VERIFICA NOVAMENTE
          // =====================

          if (
            currentMarriages[userId].includes(
              target.id
            )
          ) {

            return button.update({

              embeds: [

                new EmbedBuilder()

                  .setColor(
                    global.getEmbedColor(
                      interaction.guild.id
                    )
                  )

                  .setTitle(
                    "💍 Casamento"
                  )

                  .setDescription(
                    `Vocês já são casados.`
                  )

              ],

              components: []

            });

          }

          // =====================
          // CASAMENTO
          // =====================

          currentMarriages[userId].push(
            target.id
          );

          currentMarriages[target.id].push(
            userId
          );

          saveMarriages(
            currentMarriages
          );

          // =====================
          // LOVE SYSTEM
          // =====================

          const loveData =
            loadLove();

          const pair =
            getPairId(
              userId,
              target.id
            );

          if (!loveData[pair]) {

            loveData[pair] = {

              love: 100,

              marriedSince:
                Date.now(),

              handshake: 0,
              patpat: 0,
              hug: 0,
              kiss: 0,

              lastInteraction:
                Date.now()

            };

            saveLove(
              loveData
            );

          }

          // =====================
          // RESULTADO
          // =====================

          const embed =
            new EmbedBuilder()

              .setColor(
                global.getEmbedColor(
                  interaction.guild.id
                )
              )

              .setTitle(
                "💍 Casamento realizado!"
              )

              .setDescription(
                `${interaction.user} e ${target} agora estão oficialmente casados! 💕\n\n` +
                `❤️ Os dois aceitaram o casamento.`
              )

              .addFields({

                name:
                  "❤️ LovePoints",

                value:
                  "100/100",

                inline: true

              })

              .setTimestamp();

          return button.update({

            embeds: [embed],

            components: []

          });

        }

        // =====================
        // APENAS UM CONFIRMOU
        // =====================

        const userStatus =
          confirmed.has(userId)
            ? "✅ Confirmado"
            : "⏳ Aguardando";

        const targetStatus =
          confirmed.has(target.id)
            ? "✅ Confirmado"
            : "⏳ Aguardando";

        const waitingEmbed =
          new EmbedBuilder()

            .setColor(
              global.getEmbedColor(
                interaction.guild.id
              )
            )

            .setTitle(
              "💍 Pedido de casamento"
            )

            .setDescription(
              `${interaction.user} está pedindo ${target} em casamento! 💕\n\n` +
              `💍 **Os dois precisam aceitar o casamento.**\n\n` +
              `❤️ ${interaction.user} — ${userStatus}\n` +
              `❤️ ${target} — ${targetStatus}`
            )

            .setFooter({
              text:
                "Aguardando a confirmação da outra pessoa..."
            });

        return button.update({

          embeds: [waitingEmbed],

          components: [row]

        });

      }
    );

    // =====================
    // EXPIRADO
    // =====================

    collector.on(
      "end",
      async (collected, reason) => {

        if (
          reason === "married" ||
          reason === "cancelled"
        )
          return;

        try {

          const expiredEmbed =
            new EmbedBuilder()

              .setColor(
                global.getEmbedColor(
                  interaction.guild.id
                )
              )

              .setTitle(
                "⏰ Pedido de casamento expirado"
              )

              .setDescription(
                "O tempo para os dois confirmarem o casamento acabou."
              );

          await interaction.editReply({

            embeds: [expiredEmbed],

            components: []

          });

        } catch {}

      }
    );

  }

};
