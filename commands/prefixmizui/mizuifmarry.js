
const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const fs = require("fs");
const { file } = require("../../storage");

const MARRIAGE_LOVE_FILE = file("marriageLove.json");
const MARRIAGE_DISPLAY_FILE = file("marriageDisplay.json");

function loadMarriageLove() {
    if (!fs.existsSync(MARRIAGE_LOVE_FILE)) return {};

    try {
        return JSON.parse(
            fs.readFileSync(MARRIAGE_LOVE_FILE, "utf8")
        );
    } catch {
        return {};
    }
}

function loadMarriageDisplay() {
    if (!fs.existsSync(MARRIAGE_DISPLAY_FILE)) return {};

    try {
        return JSON.parse(
            fs.readFileSync(MARRIAGE_DISPLAY_FILE, "utf8")
        );
    } catch {
        return {};
    }
}

function saveMarriageDisplay(data) {
    fs.writeFileSync(
        MARRIAGE_DISPLAY_FILE,
        JSON.stringify(data, null, 2)
    );
}

module.exports = {
    name: "fmarry",
    description: "Escolhe qual cônjuge será exibido no perfil.",

    async execute(message, args) {

        const userId = message.author.id;

        // Carrega todos os casamentos
        const marriages = loadMarriageLove();

        const spouses = [
            ...new Set(marriages[userId] || [])
        ].filter(id => id !== userId);

        if (spouses.length === 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(global.getEmbedColor(message.guild.id))
                        .setTitle("💔 Nenhum casamento encontrado")
                        .setDescription(
                            "Você não possui nenhum casamento registrado."
                        )
                ]
            });
        }

        // O Discord permite até 25 opções por menu
        const options = [];

        for (const spouseId of spouses.slice(0, 25)) {

            const spouse = await message.client.users
                .fetch(spouseId)
                .catch(() => null);

            options.push({
                label: spouse
                    ? (spouse.globalName || spouse.username).slice(0, 100)
                    : `Usuário ${spouseId}`,
                description: spouse
                    ? `Selecionar ${spouse.username}`.slice(0, 100)
                    : "Usuário indisponível",
                value: spouseId
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`mizuifmarry_${userId}`)
            .setPlaceholder("Escolha qual cônjuge deseja exibir...")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(options);

        const row = new ActionRowBuilder()
            .addComponents(menu);

        const embed = new EmbedBuilder()
            .setColor(global.getEmbedColor(message.guild.id))
            .setTitle("💍 Escolha seu cônjuge")
            .setDescription(
                `Você possui **${spouses.length} casamento(s)** registrados.\n\n` +
                "Selecione a pessoa que deseja exibir no seu perfil."
            )
            .setFooter({
                text: "Sua escolha não altera nem remove seus casamentos."
            });

        if (spouses.length > 25) {
            embed.addFields({
                name: "⚠️ Limite do menu",
                value: "O Discord permite até 25 opções por menu. Apenas os primeiros 25 casamentos aparecem aqui."
            });
        }

        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        collector.on("collect", async (i) => {

            if (i.user.id !== userId) {
                return i.reply({
                    content: "❌ Apenas quem utilizou o comando pode escolher.",
                    ephemeral: true
                });
            }

            if (i.customId !== `mizuifmarry_${userId}`) return;

            const selectedId = i.values[0];

            // Confere novamente se o casamento ainda existe
            const currentMarriages = loadMarriageLove();

            if (!(currentMarriages[userId] || []).includes(selectedId)) {
                collector.stop("invalid");
                return i.update({
                    content: "❌ Esse casamento não está mais registrado.",
                    embeds: [],
                    components: []
                });
            }

            // Salva somente a escolha de exibição
            const displayData = loadMarriageDisplay();

            displayData[userId] = selectedId;

            saveMarriageDisplay(displayData);

            const selectedUser = await message.client.users
                .fetch(selectedId)
                .catch(() => null);

            const successEmbed = new EmbedBuilder()
                .setColor(global.getEmbedColor(message.guild.id))
                .setTitle("💜 Cônjuge selecionado!")
                .setDescription(
                    `Agora seu perfil exibirá ${selectedUser ? selectedUser : `o usuário \`${selectedId}\``} como cônjuge.`
                )
                .setFooter({
                    text: "Seus outros casamentos continuam registrados."
                });

            await i.update({
                embeds: [successEmbed],
                components: []
            });

            collector.stop("selected");
        });

        collector.on("end", async () => {
            msg.edit({
                components: []
            }).catch(() => {});
        });
    }
};

