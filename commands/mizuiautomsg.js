const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

const file = "./automsg.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("automsg")
        .setDescription("Configura a mensagem automática.")
        .addStringOption(option =>
            option
                .setName("mensagem")
                .setDescription("Mensagem que o bot enviará.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const mensagem = interaction.options.getString("mensagem");

        let db = {};

        if (fs.existsSync(file)) {
            db = JSON.parse(fs.readFileSync(file, "utf8"));
        }

        db[interaction.guild.id] = {
            message: mensagem
        };

        fs.writeFileSync(file, JSON.stringify(db, null, 4));

        await interaction.reply({
            content: "✅ Mensagem automática configurada.",
            ephemeral: true
        });
    }
};
