require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

console.log("DEPLOY EM:", __dirname);

const commands = [];

// 🔥 loader recursivo seguro
function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    // 🚫 IGNORA PREFIX SYSTEM
    if (fullPath.includes("prefixmizui")) {
      console.log("⛔ IGNORANDO PREFIX:", file);
      continue;
    }

    let stat;
    try {
      stat = fs.lstatSync(fullPath);
    } catch {
      continue;
    }

    // 📁 pasta → recursivo
    if (stat.isDirectory()) {
      loadCommands(fullPath);
      continue;
    }

    // só js
    if (!file.endsWith(".js")) continue;

    // limpa cache
    try {
      delete require.cache[require.resolve(fullPath)];
    } catch {}

    let command;

    try {
      command = require(fullPath);
    } catch (err) {
      console.log("💥 ERRO NO REQUIRE:", file);
      console.log(err.message);
      continue;
    }

    console.log("📦 FILE:", file);

    // ❌ validações seguras
    if (!command) {
      console.log("❌ COMANDO VAZIO:", file);
      continue;
    }

    if (!command.data) {
      console.log("❌ SEM DATA:", file);
      continue;
    }

    if (!command.data.toJSON) {
      console.log("❌ DATA SEM TOJSON:", file);
      continue;
    }

    if (!command.data.name) {
      console.log("❌ SEM NAME:", file);
      continue;
    }

    try {
      commands.push(command.data.toJSON());
      console.log("✅ OK:", command.data.name);
    } catch (err) {
      console.log("💥 ERRO TOJSON:", file);
      console.log(err.message);
    }
  }
}

// 🔥 inicia na pasta commands
loadCommands(path.join(__dirname, "commands"));

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_TOKEN
);

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