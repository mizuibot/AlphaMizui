const {
EmbedBuilder,
PermissionsBitField
} = require("discord.js");

const COLORS = {
vermelho: "#FF0000",
azul: "#0000FF",
verde: "#00FF00",
roxo: "#9370DB",
rosa: "#FF69B4",
amarelo: "#FFFF00",
laranja: "#FFA500",
preto: "#000000",
branco: "#FFFFFF",

red: "#FF0000",
blue: "#0000FF",
green: "#00FF00",
purple: "#9370DB",
pink: "#FF69B4",
yellow: "#FFFF00",
orange: "#FFA500",
black: "#000000",
white: "#FFFFFF"
};

module.exports = {
name: "coloremb",

async execute(message, args) {

if (
  !message.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )
) {
  return message.reply(
    "❌ Apenas administradores podem alterar a cor dos embeds."
  );
}

let color = args[0]?.toLowerCase();

if (!color) {
  return message.reply(
    "❌ Use: `mizuicoloremb vermelho` ou `mizuicoloremb #9370DB`"
  );
}

if (COLORS[color]) {
  color = COLORS[color];
}

if (!/^#([0-9A-F]{6})$/i.test(color)) {
  return message.reply(
    "❌ Cor inválida.\nExemplos: `vermelho`, `azul`, `roxo`, `#9370DB`"
  );
}

global.embedColors[
  message.guild.id
] = color;

global.saveEmbedColors(
  global.embedColors
);

const embed = new EmbedBuilder()
  .setTitle("🎨 Cor alterada")
  .setDescription(
    `Nova cor dos embeds:\n\`${color}\``
  )
  .setColor(color);

return message.reply({
  embeds: [embed]
});

}
};