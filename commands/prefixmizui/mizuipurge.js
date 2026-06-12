const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "purge",

  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ Sem permissão.");
    }

    const amount = parseInt(args[0]);

    if (!amount || isNaN(amount)) {
      return message.reply("❌ Use: purge <quantidade>");
    }

    if (amount < 1 || amount > 100) {
      return message.reply("❌ Só posso apagar entre 1 e 100 mensagens.");
    }

    try {

      const messages = await message.channel.messages.fetch({ limit: amount });

      await message.channel.bulkDelete(messages, true);

      const confirm = await message.channel.send(`🧹 ${amount} mensagens apagadas.`);

      setTimeout(() => confirm.delete().catch(() => {}), 3000);

    } catch (err) {
      console.log(err);
      return message.reply("❌ Erro ao limpar mensagens.");
    }
  }
};