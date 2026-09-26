const { EmbedBuilder } = require('discord.js');
const Economy = require('./economy');

module.exports = {
    name: 'linhagem',
    description: 'Mostra a árvore genealógica de uma pessoa.',

    async execute(message, args) {
        const pessoa = message.mentions.users.first() || message.author;

        const filhos = Family.getAdopted(pessoa.id);

        if (filhos.length === 0) {
            const embed = new EmbedBuilder()
                .setTitle(`🌳 Linhagem de ${pessoa.username}`)
                .setDescription(
                    `${pessoa} ainda não possui filhos adotivos.`
                )
                .setThumbnail(
                    pessoa.displayAvatarURL({ dynamic: true })
                )
                .setColor('Green');

            return message.reply({
                embeds: [embed]
            });
        }

        const visitados = new Set();

        async function criarArvore(userId, nivel = 0) {
            if (visitados.has(userId)) {
                return '';
            }

            visitados.add(userId);

            const filhos = Family.getAdopted(userId);

            if (filhos.length === 0) {
                return '';
            }

            let resultado = '';

            for (const filhoId of filhos) {
                try {
                    const filho = await message.client.users.fetch(filhoId);

                    resultado +=
                        `${'│   '.repeat(nivel)}├── 👶 ${filho}\n`;

                    resultado += await criarArvore(
                        filhoId,
                        nivel + 1
                    );
                } catch {
                    resultado +=
                        `${'│   '.repeat(nivel)}├── 👶 <@${filhoId}>\n`;
                }
            }

            return resultado;
        }

        const arvore = await criarArvore(pessoa.id);

        const embed = new EmbedBuilder()
            .setTitle(`🌳 Linhagem de ${pessoa.username}`)
            .setDescription(
                `👤 **${pessoa}**\n` +
                arvore
            )
            .setThumbnail(
                pessoa.displayAvatarURL({ dynamic: true })
            )
            .setColor('Green')
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};
