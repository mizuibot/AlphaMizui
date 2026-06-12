module.exports = {
  name: "stopdc",

  async execute(message) {

    if (global.mizuiRotatingStatus) {
      clearInterval(global.mizuiRotatingStatus);
      global.mizuiRotatingStatus = null;
    }

    return message.reply("🛑 Rotação parada.");
  }
};