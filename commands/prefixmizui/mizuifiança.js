
const { EmbedBuilder } = require("discord.js");
const { loadDB, saveDB } = require("../../economy");

module.exports = {
    name: "fianca",
    description: "Paga a fiança de outro usuário.",

    async execute(message, args) {
        try {
            // Usuário que será libertado
            const target = message.mentions.users.first();

            if (!target) {
                return message.reply("❌ Use: `mizuifianca @usuário`");
            }

            const userId = target.id;
            const payerId = message.author.id;

            // Verifica o sistema de prisão
            if (!global.jail || typeof global.jail.get !== "function") {
                return message.reply("❌ O sistema de prisão está indisponível.");
            }

            const jailed = global.jail.get(userId);

            if (!jailed || jailed.until <= Date.now()) {
                return message.reply("❌ Esse usuário não está preso.");
            }

            // Valor da fiança
            const FIANCA = 345000n;

            const db = loadDB();

            if (!db || typeof db !== "object") {
                return message.reply("❌ Não foi possível carregar a economia.");
            }

            // Confere a conta do pagador
            if (!db[payerId]) {
                return message.reply("❌ Você não possui conta na economia.");
            }

            const wallet = BigInt(db[payerId].coins || "0");
            const bank = BigInt(db[payerId].bank || "0");

            if (wallet < 0n || bank < 0n) {
                return message.reply("❌ Saldo inválido na economia.");
            }

            const total = wallet + bank;

            if (total < FIANCA) {
                return message.reply(
                    `❌ Você não possui **${FIANCA.toLocaleString("pt-BR")} mzcoins** para pagar a fiança.`
                );
            }

            // Desconta primeiro da carteira
            let remaining = FIANCA;

            if (wallet >= remaining) {
                db[payerId].coins = (wallet - remaining).toString();
                remaining = 0n;
            } else {
                db[payerId].coins = "0";
                remaining -= wallet;
            }

            // Completa o pagamento com o banco
            if (remaining > 0n) {
                db[payerId].bank = (bank - remaining).toString();
            }

            saveDB(db);

            // Liberta o usuário
            global.jail.delete(userId);

            const embed = new EmbedBuilder()
                .setColor(global.getEmbedColor(message.guild.id))
                .setTitle("⚖️ Fiança paga!")
                .setDescription(
                    `${target} foi libertado da prisão.\n\n💸 ${message.author} pagou **${FIANCA.toLocaleString("pt-BR")} mzcoins** pela fiança.`
                )
                .addFields(
                    {
                        name: "👤 Libertado",
                        value: `${target}`,
                        inline: true
                    },
                    {
                        name: "💰 Pagador",
                        value: `${message.author}`,
                        inline: true
                    }
                )
                .setTimestamp();

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error("ERRO NA FIANÇA:", error);

            return message.reply(
                `❌ Erro ao pagar a fiança:\n\`\`\`js\n${String(error.message || error).slice(0, 1000)}\n\`\`\``
            );
        }
    }
};

