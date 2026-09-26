const { EmbedBuilder } = require("discord.js");
const Economy = require("../../economy");

module.exports = {
    name: "linhagem",

    async execute(message) {
        const alvo = message.mentions.users.first() || message.author;

        const visitados = new Set();

        async function montarArvore(userId, prefix = "") {
            if (visitados.has(userId)) return "";

            visitados.add(userId);

            const filhos = Economy.getChildren(userId);

            if (!filhos || filhos.length === 0) {
                return "";
            }

            let arvore = "";

            for (let i = 0; i < filhos.length; i++) {
                const filhoId = filhos[i];

                const filho = await message.client.users
                    .fetch(filhoId)
                    .catch(() => null);

                if (!filho) continue;

                const ultimo = i === filhos.length - 1;

                arvore += `${prefix}${ultimo ? "└──" : "├──"} 👤 ${filho.username}\n`;

                arvore += await montarArvore(
                    filhoId,
                    prefix + (ultimo ? "    " : "│   ")
                );
            }

            return arvore;
        }

        const arvore = await montarArvore(alvo.id);

        const descricao = arvore
            ? `👤 **${alvo.username}**\n${arvore}`
            : `👤 **${alvo.username}**\n\n> Essa pessoa não possui descendentes.`;

        const embed = new EmbedBuilder()
            .setTitle("🌳 Linhagem")
            .setDescription(descricao)
            .setColor("#9b59b6")
            .setThumbnail(
                alvo.displayAvatarURL({ dynamic: true })
            );

        await message.reply({
            embeds: [embed]
        });
    }
};
