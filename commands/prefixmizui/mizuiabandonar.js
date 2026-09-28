const { EmbedBuilder } = require("discord.js");
const Economy = require("../../economy");

module.exports = {
    name: "abandonar",
    description: "Abandona uma ou várias pessoas.",

    async execute(message, args) {

        const pessoas = [...message.mentions.users.values()];

        if (pessoas.length < 1) {
            const embed = new EmbedBuilder()
                .setColor(global.getEmbedColor(message.guild.id))
                .setTitle("❌ Pessoa não informada")
                .setDescription(
                    "Mencione pelo menos uma pessoa para abandonar.\n\n" +
                    "**Exemplo:**\n" +
                    "`mizuiabandonar @Pessoa1 @Pessoa2`"
                );

            return message.reply({
                embeds: [embed]
            });
        }

        // Remove menções duplicadas
        const unicas = [
            ...new Map(
                pessoas.map(user => [user.id, user])
            ).values()
        ];

        const abandonadas = [];
        const inexistentes = [];

        for (const pessoa of unicas) {

            const resultado = Economy.removeChild(
                message.author.id,
                pessoa.id,
                message.guild.id
            );

            if (resultado) {
                abandonadas.push(pessoa);
            } else {
                inexistentes.push(pessoa);
            }
        }

        let descricao = "";

        if (abandonadas.length > 0) {
            descricao +=
                "💔 **Pessoas abandonadas:**\n\n" +
                abandonadas
                    .map(user => `• ${user}`)
                    .join("\n");
        }

        if (inexistentes.length > 0) {

            if (descricao) {
                descricao += "\n\n";
            }

            descricao +=
                "⚠️ **Não encontradas como seus filhos:**\n" +
                inexistentes
                    .map(user => `• ${user}`)
                    .join("\n");
        }

        const embed = new EmbedBuilder()
            .setColor(global.getEmbedColor(message.guild.id))
            .setTitle("💔 Abandono")
            .setDescription(descricao)
            .setFooter({
                text: `Ação realizada por ${message.author.username}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    }
};
