const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");

const MARRIAGES_FILE = path.resolve(
process.cwd(),
"marriages.json"
);

const SHIP_BG = path.join(
__dirname,
"preview.png"
);

function loadMarriages() {
if (!fs.existsSync(MARRIAGES_FILE))
return {};

try {
return JSON.parse(
fs.readFileSync(
MARRIAGES_FILE,
"utf8"
)
);
} catch {
return {};
}
}

async function getBuffer(url) {
return Buffer.from(
await fetch(url).then(r =>
r.arrayBuffer()
)
);
}

function getShipPercent(id1, id2) {
const pair = [id1, id2]
.sort()
.join("-");

const hash = crypto
.createHash("md5")
.update(pair)
.digest("hex");

return (
parseInt(hash.slice(0, 8), 16) %
101
);
}

function createShipName(a, b) {
const first =
a.slice(
0,
Math.ceil(a.length / 2)
);

const second =
b.slice(
Math.floor(b.length / 2)
);

return first + second;
}

module.exports = {
name: "ship",

async execute(message) {

let user1;
let user2;

const mentions =
  [...message.mentions.users.values()];

if (mentions.length === 1) {
  user1 = message.author;
  user2 = mentions[0];
}
else if (mentions.length >= 2) {
  user1 = mentions[0];
  user2 = mentions[1];
}
else {
  return message.reply(
    "❌ Use: `mizuiship @usuário` ou `mizuiship @usuário @usuário`"
  );
}

const marriages =
  loadMarriages();

const married =
  marriages[user1.id]?.[0] ===
    user2.id ||
  marriages[user2.id]?.[0] ===
    user1.id;

const percent =
  married
    ? 100
    : getShipPercent(
        user1.id,
        user2.id
      );

const messages = [
  " O cupido passou longe hoje.",
  " Melhor ficarem só na amizade.",
  " Existe uma conexão interessante.",
  " Vocês parecem combinar.",
  " Há algo especial aqui.",
  " O romance está surgindo.",
  " Casal promissor.",
  " Química detectada!",
  " Feitos um para o outro.",
  " Casamento em breve!"
];

const randomMessage =
  messages[
    Math.floor(
      Math.random() *
      messages.length
    )
  ];

const shipName =
  createShipName(
    user1.username,
    user2.username
  );

const avatar1 =
  user1.displayAvatarURL({
    extension: "png",
    size: 512
  });

const avatar2 =
  user2.displayAvatarURL({
    extension: "png",
    size: 512
  });

const bgImage =
  await sharp(SHIP_BG)
    .resize(900, 500)
    .png()
    .toBuffer();

const mask =
  Buffer.from(`
  <svg width="180" height="180">
    <circle
      cx="90"
      cy="90"
      r="90"
      fill="white"
    />
  </svg>
`);

const avatarBuffer1 =
  await sharp(
    await getBuffer(avatar1)
  )
    .resize(180, 180)
    .composite([
      {
        input: mask,
        blend: "dest-in"
      }
    ])
    .png()
    .toBuffer();

const avatarBuffer2 =
  await sharp(
    await getBuffer(avatar2)
  )
    .resize(180, 180)
    .composite([
      {
        input: mask,
        blend: "dest-in"
      }
    ])
    .png()
    .toBuffer();

const svg = `

<svg
width="900"
height="500"
xmlns="http://www.w3.org/2000/svg">

<image
href="data:image/png;base64,${bgImage.toString("base64")}"
width="900"
height="500"/>

<rect
width="900"
height="500"
fill="rgba(0,0,0,0.45)"/>

<image
href="data:image/png;base64,${avatarBuffer1.toString("base64")}"
x="120"
y="150"
width="180"
height="180"/>

<image
href="data:image/png;base64,${avatarBuffer2.toString("base64")}"
x="600"
y="150"
width="180"
height="180"/>

<text
x="450"
y="140"
fill="white"
font-size="80"
text-anchor="middle">

</text>

<text
x="450"
y="250"
fill="white"
font-size="72"
font-weight="bold"
text-anchor="middle">
${percent}%
</text>

<text
x="450"
y="320"
fill="white"
font-size="36"
font-weight="bold"
text-anchor="middle">
${shipName}
</text>

<text
x="450"
y="380"
fill="white"
font-size="24"
text-anchor="middle">
${randomMessage}
</text>

</svg>
`;const image =
  await sharp(
    Buffer.from(svg)
  )
    .png()
    .toBuffer();

return message.reply({
  files: [
    {
      attachment: image,
      name: "ship.png"
    }
  ]
});

}
};
