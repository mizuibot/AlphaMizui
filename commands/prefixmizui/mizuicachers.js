module.exports = {
  name: "cachers",
  description: "Reseta toda a memória da Mizui",

  async execute(message, args, client) {
    try {
      // segurança (opcional: só você pode usar)
      const ownerIds = [
        "1501604830924505300",
        "1474842295009284158",
        "1324278945499316267"
      ];

      if (!ownerIds.includes(message.author.id)) {
        return message.reply("❌ Você não pode usar esse comando.");
      }

      // 🔥 LIMPA HISTÓRICO (IA)
      const history = client.history;
      if (history && typeof history.clear === "function") {
        history.clear();
      }

      // 🔥 LIMPA CACHE DE GUILD
      if (client.mizuiGuildData && typeof client.mizuiGuildData.clear === "function") {
        client.mizuiGuildData.clear();
      }

      // 🔥 LIMPA MAP GLOBAL (caso exista)
      if (global.history) global.history.clear?.();

      // 🔥 LIMPA LANGS (opcional, cuidado)
      if (global.languages) global.languages.clear?.();

      // 🔥 LIMPA CHANNELS CACHE
      if (global.channels) global.channels.clear?.();

      return message.reply("✅ Mizui teve toda a memória resetada com sucesso.");
    } catch (err) {
      console.log(err);
      return message.reply("❌ Erro ao resetar memória.");
    }
  }
};