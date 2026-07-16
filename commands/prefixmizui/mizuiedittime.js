module.exports = {
  name: "edittime",

  async execute(message, args, client) {
    const ADMIN_ROLE_ID = "1474913659640746105";

    const AUTORIZADOS = [
      "1506406102454239398",
      "1501604830924505300",
      "1290497952653119564"
    ];

    const hasRole =
      message.member?.roles?.cache?.has(ADMIN_ROLE_ID);

    const isAutorizado =
      AUTORIZADOS.includes(message.author.id);

    if (!hasRole && !isAutorizado) {
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
