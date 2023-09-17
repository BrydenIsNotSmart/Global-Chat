const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "link",
    aliases: ["globalchat", "channel", "setchannel"],
    category: "Config",
    description: "Sets the globalchat channel on this server.",
    async run(client, message, args) {
      try {
        const server = await serverModel.findOne({ serverId: message.server.id });
          const permissionsEmbed = new Embed()
           .setColor("#77b4d3")
           .setDescription(":x: You need the \"Manage Server\" permission to use this command.");
          if (!message.member.hasPermission(message.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] });
         const argsEmbed = new Embed()
         .setColor("#77b4d3")
         .setDescription(":x: Please provide a correct channel mention or ID to set the logging channel.");
         if (!args[0]) return message.reply({ embeds: [argsEmbed] }, false);
         await client.channels.fetch(args[0].match(new RegExp(`(<#!?(.*)>)`))[2]).catch(() => { });
         await client.channels.fetch(args[0]).catch(() => { });
         const channel = client.channels.find(c => c.id === args[0].match(new RegExp(`(<#!?(.*)>)`))[2]) || client.channels.find(c => c.id === args[0]);
         if (!channel) return message.reply({ embeds: [argsEmbed] }, false);
         if (channel.id == server.globalChatChannel) return message.reply(`:x: This channel is already set as the current globalchat channel.`, false)
         const embed = new Embed()
         .setColor("#77b4d3")
         .setDescription("### **Global Chat**\nThis channel has been selected as globalchat channel.\nThis channel will now receive messages from other servers when sent.")
           try {
            if (server.blacklisted) return message.reply(":x: This server is blacklisted from ever using the globalchat.")

            server.globalChatChannel = channel.id;
            server.globalChatEnabled = true;
             await server.save();
             if (channel.havePermission("SendMessage")) {
              channel.sendMessage({ embeds: [embed] });
             } else {
              message.channel.sendMessage(":x: I don't have permission to send messages in the chosen channel.")
            }
            if (!message.server.havePermission("Masquerade")) {
              message.channel.sendMessage(":x: I need the `Masquerade` permission in order to send global chat messages.")
            }
            if (!message.server.havePermission("ManageRole")) {
              message.channel.sendMessage(":warning: I don't have the permission `ManageRole`, this permission is used to set the role colour in the globalchats.\n **It's not required.**")
            }
             message.reply(`:white_check_mark: The globalchat channel has been successfully set to <#${channel.id}>.`, false)
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