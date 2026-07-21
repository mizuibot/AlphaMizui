const { SlashCommandBuilder } = require("discord.js");

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

        db.set(interaction.guild.id, {
            message: mensagem
        });

        await interaction.reply({
            content: "✅ Mensagem automática configurada.",
            ephemeral: true
        });
    }
};
