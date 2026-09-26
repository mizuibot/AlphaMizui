const { EmbedBuilder } = require('discord.js');
const Economy = require("../../economy");

module.exports = {
    name: 'abandonar',
    description: 'Abandona uma pessoa da sua família.',

    async execute(message, args) {
        const pessoa = message.mentions.users.first();

        if (!pessoa) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Pessoa não encontrada')
                .setDescription(
                    'Mencione a pessoa que você deseja abandonar.\n\n' +
                    '**Exemplo:** `!abandonar @Pessoa`'
                )
                .setColor('Red');

            return message.reply({ embeds: [embed] });
        }

        if (pessoa.id === message.author.id) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Ação inválida')
                .setDescription('Você não pode abandonar a si mesmo.')
                .setColor('Red');

            return message.reply({ embeds: [embed] });
        }

        const familia = Family.getFamily(message.author.id);

        if (!familia) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Você não tem uma família')
                .setDescription(
                    'Você não pertence a nenhuma família atualmente.'
                )
                .setColor('Red');

            return message.reply({ embeds: [embed] });
        }

        if (!familia.members.includes(pessoa.id)) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Pessoa não encontrada')
                .setDescription(
                    `${pessoa} não faz parte da sua família.`
                )
                .setColor('Red');

            return message.reply({ embeds: [embed] });
        }

        Family.removeMember(message.author.id, pessoa.id);

        const embed = new EmbedBuilder()
            .setTitle('🚪 Abandono')
            .setDescription(
                `**${message.author}** abandonou **${pessoa}** da família.\n\n` +
                `💀 Não houve votação. A decisão foi unilateral.`
            )
            .setThumbnail(pessoa.displayAvatarURL({ dynamic: true }))
            .setColor('DarkRed')
            .setFooter({
                text: `Ação realizada por ${message.author.username}`
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};
