const { EmbedBuilder } = require("discord.js");
const Economy = require("../../economy");

module.exports = {
    name: "arvoreg",
    description: "Mostra sua árvore genealógica.",

    async execute(message, args) {

        const guildId = message.guild.id;
        const alvo = message.author;

        // Procura o ancestral mais antigo
        let raizId = alvo.id;
        const ancestrais = new Set();

        while (true) {

            if (ancestrais.has(raizId)) {
                break;
            }

            ancestrais.add(raizId);

            const parentId = Economy.getParent(
                raizId,
                guildId
            );

            if (!parentId) {
                break;
            }

            raizId = parentId;
        }

        const visitados = new Set();

        async function montarArvore(
            userId,
            prefix = "",
            raiz = false
        ) {

            if (visitados.has(userId)) {
                return "";
            }

            visitados.add(userId);

            const user =
                await message.client.users
                    .fetch(userId)
                    .catch(() => null);

            if (!user) {
                return "";
            }

            let resultado = "";

            if (raiz) {
                resultado += `👑 **${user.username}**\n`;
            }

            const filhos = Economy.getChildren(
                userId,
                guildId
            );

            for (let i = 0; i < filhos.length; i++) {

                const filhoId = filhos[i];

                if (visitados.has(filhoId)) {
                    continue;
                }

                const filho =
                    await message.client.users
                        .fetch(filhoId)
                        .catch(() => null);

                if (!filho) {
                    continue;
                }

                const ultimo =
                    i === filhos.length - 1;

                resultado +=
                    `${prefix}${ultimo ? "└── " : "├── "}👤 ${filho.username}\n`;

                resultado += await montarArvore(
                    filhoId,
                    prefix + (
                        ultimo
                            ? "    "
                            : "│   "
                    )
                );
            }

            return resultado;
        }

        const arvore = await montarArvore(
            raizId,
            "",
            true
        );

        const embed = new EmbedBuilder()
            .setColor(global.getEmbedColor(message.guild.id))
            .setTitle("🌳 Sua Árvore Genealógica")
            .setDescription(
                arvore ||
                "Você ainda não possui relações familiares registradas."
            )
            .setThumbnail(
                alvo.displayAvatarURL({
                    dynamic: true
                })
            )
            .setFooter({
                text: `Árvore de ${alvo.username}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    }
};
