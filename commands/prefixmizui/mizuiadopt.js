const { EmbedBuilder } = require('discord.js');
const Economy = require('./Economy');

module.exports = {
    name: 'adotar',
    description: 'Adota uma ou várias pessoas.',

    async execute(message, args) {

        // Pega todas as pessoas mencionadas
        const pessoas = [...message.mentions.users.values()];

        // Precisa de pelo menos 2 pessoas
        if (pessoas.length < 2) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Pessoas insuficientes')
                .setDescription(
                    'Você precisa mencionar pelo menos **2 pessoas**.\n\n' +
                    '**Exemplo:**\n' +
                    '`!adotar @Pessoa1 @Pessoa2 @Pessoa3 ...`'
                )
                .setColor('Red');

            return message.reply({ embeds: [embed] });
        }

        // Impede a mesma pessoa de aparecer mais de uma vez
        const unicas = [...new Map(
            pessoas.map(user => [user.id, user])
        ).values()];

        // Cria a lista de pessoas
        const lista = unicas
            .map((user, index) => `${index + 1}. ${user}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🏠 Adoção em família!')
            .setDescription(
                `💖 **Uma nova família foi formada!**\n\n` +
                `${lista}\n\n` +
                `👨‍👩‍👧‍👦 Essas pessoas agora fazem parte da mesma família!`
            )
            .setColor('Random')
            .setFooter({
                text: `Adoção realizada por ${message.author.username}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    }
};
