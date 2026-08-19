const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unslowmode",

  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("❌ Apenas administradores podem usar este comando.");
    }

    try {
      await message.channel.setRateLimitPerUser(0);

      return message.reply("✅ Slowmode desativado com sucesso!");
    } catch (error) {
      console.error(error);

      return message.reply(
        "❌ Não consegui desativar o slowmode. Verifique minhas permissões."
      );
    }
  }
};
