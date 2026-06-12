const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../prefixes.json"
);

const OWNER_ID = "1501604830924505300";

function loadPrefixes() {

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(
      FILE,
      JSON.stringify({}, null, 2)
    );
  }

  return JSON.parse(
    fs.readFileSync(FILE, "utf8")
  );
}

function savePrefixes(data) {
  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mizuisetprefix")
    .setDescription("Altera o prefixo do servidor")
    .addStringOption(option =>
      option
        .setName("prefixo")
        .setDescription("Novo prefixo")
        .setRequired(true)
    ),

  async execute(interaction) {

    const isOwner =
      interaction.user.id === OWNER_ID;

    const isAdmin =
      interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      );

    if (!isOwner && !isAdmin) {
      return interaction.reply({
        content:
          "❌ Apenas o criador ou administradores podem alterar o prefixo.",
        ephemeral: true
      });
    }

    const prefix =
      interaction.options.getString("prefixo");

    if (prefix.length > 5) {
      return interaction.reply({
        content:
          "❌ O prefixo pode ter no máximo 5 caracteres.",
        ephemeral: true
      });
    }

    const data = loadPrefixes();

    data[interaction.guild.id] = prefix;

    savePrefixes(data);

    const embed = new EmbedBuilder()
      .setColor(global.getEmbedColor(interaction.guild.id))
      .setTitle("⚙️ Prefixo Alterado")
      .setDescription(`Novo prefixo:\n\`${prefix}\``);

    return interaction.reply({
      embeds: [embed]
    });
  }
};