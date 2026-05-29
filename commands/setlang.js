const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const LANG_FILE = path.join(__dirname, "..", "languages.json");

const LANGS = {
  "pt-br": "Português (Brasil)",
  en: "English (US)",
  es: "Español",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  it: "Italiano",
  fr: "Français",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlang")
    .setDescription("Define o idioma do servidor")
    .addStringOption(option =>
      option
        .setName("idioma")
        .setDescription("Escolha o idioma")
        .setRequired(true)
        .addChoices(
          { name: "Português (Brasil)", value: "pt-br" },
          { name: "English (US)", value: "en" },
          { name: "Español", value: "es" },
          { name: "Русский", value: "ru" },
          { name: "中文", value: "zh" },
          { name: "日本語", value: "ja" },
          { name: "Italiano", value: "it" },
          { name: "Français", value: "fr" }
        )
    ),

  async execute(interaction) {
    const lang = interaction.options.getString("idioma");
    const key = interaction.guild?.id;

    if (!LANGS[lang]) {
      return interaction.reply({
        content: "❌ Idioma inválido.",
        ephemeral: true,
      });
    }

    // usa o MESMO sistema do bot (global.languages)
    global.languages.set(key, lang);

    fs.writeFileSync(
      LANG_FILE,
      JSON.stringify(Object.fromEntries(global.languages), null, 2)
    );

    return interaction.reply({
      content: `🌐 Idioma do servidor definido para: ${LANGS[lang]}`,
      ephemeral: true,
    });
  },
};
