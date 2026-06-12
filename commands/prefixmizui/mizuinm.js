module.exports = {
  name: "nm",

  async execute(message, args, client) {
    const ADMIN_ROLE_ID = "1474913659640746105";

    const hasRole =
      message.member?.roles?.cache?.has(ADMIN_ROLE_ID);

    const isDev =
      message.author.id === "1501604830924505300";

    if (!hasRole && !isDev) {
      return message.reply("❌ Você não tem permissão.");
    }

    const newName = args.join(" ").trim();

    if (!newName) {
      return message.reply("❌ Use: mizuinm <nome>");
    }

    const guild = client.getGuild(message.guild.id);

    guild.name = newName;

    try {
      await message.guild.members.me.setNickname(newName);

      return message.reply(
        `✅ Nome da Mizui mudou para: **${newName}**`
      );
    } catch (err) {
      console.log(err);

      return message.reply(
        "❌ Falha ao mudar nome no Discord."
      );
    }
  },
};