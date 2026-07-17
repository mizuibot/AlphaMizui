module.exports = {
  name: "choicebio",

  async execute(message, args, client) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão.");
    }

    const bio = args.join(" ").trim();

    if (!bio) {
      return message.reply(
        "❌ Use: `mizui choicebio <bio>`"
      );
    }

    if (bio.length > 190) {
      return message.reply(
        "❌ A bio deve ter no máximo 190 caracteres."
      );
    }

    try {
      await client.user.setAboutMe(bio);

      return message.reply(
        `✅ Bio da Mizui alterada para:\n> ${bio}`
      );

    } catch (err) {
      console.error(err);

      return message.reply(
        "❌ Não foi possível alterar a bio."
      );
    }
  },
};
