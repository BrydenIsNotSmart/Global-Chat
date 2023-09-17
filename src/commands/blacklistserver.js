const Embed = require("../functions/embed");
const serverModel = require("../database/models/server")

module.exports = {
    name: "blacklistserver",
    aliases: ["bls"],
    usage: "[serverid] (reason)",
    category: "Mod-Only",
    description: "Blacklist a server from the globalchat.",
    async run(client, message, args) {
      try {
 message.channel.startTyping();
    if (!config.modids.includes(message.author.id)) {
        message.channel.stopTyping();
        return message.reply(":x: This is an mod only command.", false);
    }

     if (!args[0]) {
       message.channel.stopTyping();
       return message.reply(`:x: Please provide me a server to blacklist.`, false)
     } 
       const server = await client.servers.get(args[0]);
       if (!server) {
         message.channel.stopTyping();
         return message.reply(`:x: I couldn't find this server on Revolt.\n**Ussage**: \`gc!blacklist <serverid> (reason)\``, false)
       }

      let serverDb = await serverModel.findOne({ serverId: server.id });
      let logs = await client.channels.get(config.channels.globalLogs);
      if (!serverDb) serverDb = await serverModel.create({ serverId: server.id });

        if (serverDb.blacklisted) {
         message.channel.stopTyping();
         return message.reply(`:x: This server is already blacklisted.`, false)
        }

       try {
        serverDb.blacklisted = true;
        serverDb.globalChatChannel = null;
        serverDb.globalChatEnabled = false;
        await serverDb.save().then(async () => {
            message.channel.stopTyping();
          message.reply(`:white_check_mark: I have successfully blacklisted **${server.name}** from using Global Chat.`, false);

            logs.sendMessage({
               content: `**${server.name}** has been blacklisted from **Global Chat**.\n**Reason**: ${args[1] || "None Provided"}`
            })

          return await server.delete(true);
        })
       } catch(err) {
        console.log(err);
       }
        
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