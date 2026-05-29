require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

console.log("DEPLOY EM:", __dirname);

const commands = [];

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(__dirname, "commands", file);

  delete require.cache[require.resolve(filePath)];

  let command;

  try {
    command = require(filePath);
  } catch (err) {
    console.log("💥 ERRO NO REQUIRE:", file);
    console.log(err);
    continue;
  }

  console.log("📦 FILE:", file);
  console.log("📦 COMMAND KEYS:", Object.keys(command || {}));

  if (!command?.data) {
    console.log("❌ SEM DATA:", file);
    continue;
  }

  if (typeof command.data.toJSON !== "function") {
    console.log("❌ DATA INVÁLIDA:", file);
    continue;
  }

  try {
    commands.push(command.data.toJSON());
  } catch (err) {
    console.log("💥 ERRO AO CONVERTER TOJSON:", file);
    console.log(err);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("📡 Registrando comandos...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ COMANDOS REGISTRADOS COM SUCESSO!");
  } catch (err) {
    console.error("💥 ERRO NO DEPLOY:", err);
  }
})();