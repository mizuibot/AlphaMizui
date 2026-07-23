const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const fs = require("fs");

const file = "./automsg.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("automsg")
        .setDescription("Configura a mensagem automática.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addStringOption(option =>
            option
                .setName("mensagem")
                .setDescription("Mensagem que será enviada.")
                .setRequired(true)
        )

        .addChannelOption(option =>
            option
                .setName("canal")
                .setDescription("Canal onde a mensagem será enviada.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("cooldown")
                .setDescription("Cooldown em segundos.")
                .setMinValue(0)
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName("ativo")
                .setDescription("Ativar ou desativar o AutoMsg.")
                .setRequired(false)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({
                content: "❌ Você não tem permissão para usar este comando.",
                ephemeral: true
            });
        }

        const mensagem = interaction.options.getString("mensagem");
        const canal = interaction.options.getChannel("canal");
        const cooldown = interaction.options.getInteger("cooldown") ?? 0;
        const ativo = interaction.options.getBoolean("ativo") ?? true;

        let db = {};

        if (fs.existsSync(file)) {
            try {
                db = JSON.parse(fs.readFileSync(file, "utf8"));
            } catch {
                db = {};
            }
        }

        db[interaction.guild.id] = {
            enabled: ativo,
            message: mensagem,
            channelId: canal.id,
            cooldown: cooldown
        };

        fs.writeFileSync(file, JSON.stringify(db, null, 4));

        await interaction.reply({
            content:
`✅ **AutoMsg configurado!**

📢 Canal: ${canal}
💬 Mensagem: ${mensagem}
⏱️ Cooldown: ${cooldown}s
🟢 Status: ${ativo ? "Ativado" : "Desativado"}`,
            ephemeral: true
        });
    }
};
