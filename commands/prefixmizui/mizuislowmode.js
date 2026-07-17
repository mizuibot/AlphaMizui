module.exports = {
  name: "slowmode",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Você não tem permissão para usar este comando.");
    }

    const tempo = args[0];

    if (!tempo) {
      return message.reply(
        "❌ Use: `mizuislowmode <0-21600>`\nExemplo: `mizuislowmode 10`"
      );
    }

    if (tempo.toLowerCase() === "off") {
      await message.channel.setRateLimitPerUser(0);
      return message.reply("✅ Slowmode desativado.");
    }

    const segundos = Number(tempo);

    if (isNaN(segundos) || segundos < 0 || segundos > 21600) {
      return message.reply(
        "❌ O tempo deve ser um número entre **0** e **21600** segundos (6 horas)."
      );
    }

    try {
      await message.channel.setRateLimitPerUser(segundos);

      if (segundos === 0) {
        return message.reply("✅ Slowmode desativado.");
      }

      return message.reply(
        `🐢 Slowmode definido para **${segundos} segundo${segundos !== 1 ? "s" : ""}**.`
      );
    } catch (err) {
      console.error(err);
      return message.reply("❌ Não foi possível alterar o slowmode.");
    }
  },
};
