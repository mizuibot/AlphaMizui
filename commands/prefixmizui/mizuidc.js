module.exports = {
  name: "dc",

  async execute(message, args, client) {

    if (global.mizuiRotatingStatus) {
      clearInterval(global.mizuiRotatingStatus);
    }

    const statuses = [
      "online",
      "idle",
      "dnd",
      "streaming"
    ];

    let index = 0;

    global.mizuiRotatingStatus = setInterval(() => {

      const current = statuses[index];

      if (current === "streaming") {

        client.user.setPresence({
          status: "online",
          activities: [
            {
              name: "Mizui",
              type: 1,
              url: "https://www.twitch.tv/twitch"
            }
          ]
        });

      } else {

        client.user.setPresence({
          status: current,
          activities: []
        });

      }

      index++;

      if (index >= statuses.length) {
        index = 0;
      }

    }, 600);

    return message.reply(
      "🔄 Rotação infinita ativada.\n🟢 Online → 🌙 Ausente → ⛔ Não Perturbe → 🟣 Transmitindo"
    );
  }
};