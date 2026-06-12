const fs = require("fs");
const path = require("path");

const PROFILES_FILE = path.resolve(
  process.cwd(),
  "profiles.json"
);

module.exports = {
  name: "setavatar",

  async execute(message, args) {

    const url = args[0];

    if (!url) {
      return message.reply(
        "❌ Use: `mizuisetavatar <link>`"
      );
    }

    let data = {};

    if (fs.existsSync(PROFILES_FILE)) {
      data = JSON.parse(
        fs.readFileSync(PROFILES_FILE, "utf8")
      );
    }

    if (!data[message.author.id]) {
      data[message.author.id] = {};
    }

    data[message.author.id].avatar = url;

    fs.writeFileSync(
      PROFILES_FILE,
      JSON.stringify(data, null, 2)
    );

    return message.reply(
      "✅ Avatar salvo com sucesso."
    );
  }
};
