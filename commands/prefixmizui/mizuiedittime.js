module.exports = {
  name: "edittime",

  async execute(message, args, client) {
    const ADMIN_ROLE_ID = "1474913659640746105";

    const hasRole =
      message.member?.roles?.cache?.has(ADMIN_ROLE_ID);

    const isDev =
      message.author.id === "1501604830924505300";

    if (!hasRole && !isDev) {
      return message.reply("❌ Você não tem permissão.");
    }

    const guild = client.getGuild(message.guild.id);

    const seconds = parseInt(args[0]);

    if (isNaN(seconds) || seconds < 1) {
      return message.reply(
        "⚠️ Use: mizuiedittime <segundos>"
      );
    }

    guild.cooldown = seconds * 1000;

    console.log(
      "COOLDOWN ALTERADO:",
      guild.cooldown
    );

    return message.reply(
      `⏱️ Cooldown agora é **${seconds}s** neste servidor.`
    );
  },
};