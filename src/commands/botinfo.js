const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "botinfo",
    aliases: ["info", "bi"],
    category: "Information",
    description: "Information on the Bot.",
    async run(client, message, args) {
      try {
      const unixstamp = Math.floor((Date.now() / 1000) | 0) - Math.floor(process.uptime());
      const connectedServers = await serverModel.find({ globalChatEnabled: true });
       const embed = new Embed()
       .setColor("#77b4d3")
       .setDescription(`### Bot Information\n**Server Count**: ${client.servers.size()}\n**Connected Servers**: ${connectedServers.length}\n**Websocket Ping**: ${Math.round(client.events.ping())}ms\n**Online since** <t:${unixstamp}:R>`)
       await message.reply({ embeds: [embed] })
      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#77b4d3")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
        await message.reply({ embeds: [embed] }, false);
      }
    },
  };