module.exports = {
  name: "resetnm",

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

    guild.name = "mizui-chan";

    try {
      await message.guild.members.me.setNickname(
        "mizui-chan"
      );

      return message.reply(
        "🔄 Nome resetado para padrão."
      );
    } catch (err) {
      console.log(err);

      return message.reply(
        "❌ Erro ao resetar nome no Discord."
      );
    }
  },
};