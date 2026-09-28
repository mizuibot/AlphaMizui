const { EmbedBuilder } = require("discord.js");
const Economy = require("../../economy");

module.exports = {
    name: "adotar",
    description: "Adota uma ou várias pessoas.",

    async execute(message, args) {

        const pessoas = [...message.mentions.users.values()];

        if (pessoas.length < 1) {
            const embed = new EmbedBuilder()
                .setColor(global.getEmbedColor(message.guild.id))
                .setTitle("❌ Pessoa não informada")
                .setDescription(
                    "Você precisa mencionar pelo menos **1 pessoa**.\n\n" +
                    "**Exemplo:**\n" +
                    "`mizuiadotar @Pessoa1 @Pessoa2 @Pessoa3`"
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

        const adotadas = [];
        const recusadas = [];

        for (const pessoa of unicas) {

            const resultado = Economy.addChild(
                message.author.id,
                pessoa.id,
                message.guild.id
            );

            if (resultado.success) {
                adotadas.push(pessoa);
            } else {
                recusadas.push({
                    user: pessoa,
                    reason: resultado.reason
                });
            }
        }

        let descricao = "";

        if (adotadas.length > 0) {
            descricao +=
                "💖 **Nova família formada!**\n\n" +
                adotadas
                    .map((user, index) =>
                        `${index + 1}. ${user}`
                    )
                    .join("\n");
        }

        if (recusadas.length > 0) {

            if (descricao) {
                descricao += "\n\n";
            }

            descricao += "⚠️ **Não foi possível adotar:**\n";

            for (const item of recusadas) {

                let motivo =
                    "não foi possível realizar a adoção.";

                if (item.reason === "self") {
                    motivo = "você não pode se adotar.";
                }

                if (item.reason === "hasParent") {
                    motivo =
                        "essa pessoa já possui um pai/mãe adotivo neste servidor.";
                }

                if (item.reason === "alreadyChild") {
                    motivo =
                        "essa pessoa já é seu filho neste servidor.";
                }

                if (item.reason === "cycle") {
                    motivo =
                        "essa adoção criaria um ciclo na árvore genealógica.";
                }

                descricao +=
                    `• ${item.user} — ${motivo}\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(global.getEmbedColor(message.guild.id))
            .setTitle("🏠 Adoção em família!")
            .setDescription(descricao)
            .setFooter({
                text: `Adoção realizada por ${message.author.username}`
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    }
};
