const fs = require("fs");
const path = require("path");

const PROFILES_FILE = path.resolve(
  process.cwd(),
  "profiles.json"
);

module.exports = {
  name: "setbanner",

  async execute(message, args) {

    const url = args[0];

    if (!url) {
      return message.reply(
        "❌ Use: `mizuisetbanner <link>`"
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

    data[message.author.id].banner = url;

    fs.writeFileSync(
      PROFILES_FILE,
      JSON.stringify(data, null, 2)
    );

    return message.reply(
      "✅ Banner salvo com sucesso."
    );
  }
};
