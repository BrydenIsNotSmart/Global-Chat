const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "unlink",
    aliases: ["rchannel", "removechannel"],
    category: "Config",
    description: "Unlinks this channel/server from the global chat.",
    async run(client, message, args) {
      try {
        const server = await serverModel.findOne({ serverId: message.server.id });
          const permissionsEmbed = new Embed()
           .setColor("#77b4d3")
           .setDescription(":x: You need the \"Manage Server\" permission to use this command.");
          if (!message.member.hasPermission(message.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] });
         if (!server.globalChatChannel || !server.globalChatEnabled) return message.reply(`:x: You don't have a channel setup yet!\nUse \`gc!link <#channel>\` to link a channel to the global chat.`, false)
           try {
            let channel = client.channels.get(server.globalChatChannel);
            server.globalChatChannel = null;
            server.globalChatEnabled = false;
             await server.save();
             if (channel.havePermission("SendMessage")) {
              channel.sendMessage(":sadge: This channel/server has been un-linked from the globalchat.");
             } 
             message.reply(`:white_check_mark: The globalchat channel has been successfully un-linked.\nYou will no longer receive or send messages between servers.`, false)
           } catch(err) {
             console.error(err);
             const errorEmbed = new Embed()
               .setColor("#77b4d3")
               .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
             await message.reply({ embeds: [errorEmbed] }, false);
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