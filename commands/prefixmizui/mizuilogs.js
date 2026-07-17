const fs = require("fs");

module.exports = {
  name: "logs",

  async execute(message) {
    const OWNERS = [
      "1501604830924505300",
      "1290497952653119564"
    ];

    if (!OWNERS.includes(message.author.id)) {
      return message.reply("❌ Você não tem permissão.");
    }

    if (!fs.existsSync("./logs.txt")) {
      return message.reply("📄 Nenhum log encontrado.");
    }

    const logs = fs
      .readFileSync("./logs.txt", "utf8")
      .split("\n")
      .slice(-20)
      .join("\n");

    return message.reply({
      content: `\`\`\`\n${logs || "Sem logs."}\n\`\`\``
    });
  },
};
