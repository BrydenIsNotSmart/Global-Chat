const serverModel = require("../database/models/server");
const userModel = require("../database/models/user")
const Embed = require('../functions/embed');
const https = require("https");
const Upload = require("revolt-uploader");
const Uploader = new Upload(client);

module.exports = {
	name: "messageCreate",
	async execute(message) {
    let logs = await client.channels.get(config.channels.globalLogs);
        try {
        if (!message.server || message.author.bot) return;
        let data = await serverModel.findOne({ serverId: message.server.id });
        if(!data) data = await serverModel.create({ serverId: message.server.id });
        const prefix = config.bot.prefix;
         if (message.author.bot) return;
        const pingEmbed = new Embed()
       .setColor("#77b4d3")
       .setDescription(`### :wave: **Heyo, I'm ${client.user.username}**\nMy prefix is for this server is **${prefix}**\nRun **${prefix}help** for a full list of my commands.`)
       if (message.content.match(new RegExp(`^(<@!?${client.user.id}>)`))) {
        message.channel.startTyping();
        setTimeout(() => { 
          message.channel.stopTyping();
          return message.reply({ embeds: [pingEmbed] }, false) }, 200);
     }
        if (!message.content.toLowerCase().startsWith(prefix)) {
           if (message.channel.id === data.globalChatChannel) {
            if (cooldown.has(message.author.id)) return message.react(encodeURI("❌"));
             let user = await userModel.findOne({ userId: message.author.id });
             if (!user) user = await userModel.create({ userId: message.author.id });
              if (user.blacklisted) return message.react(encodeURI("❌"));
              let bannedList = config.bannedWords;
              for (c in bannedList) {
               if (message.content.toLowerCase().includes(bannedList[c])){
                message.delete().catch(() => { return });
                if (!user.warning) {
                  user.warning = true;
                  await user.save();
                  return await message.author?.openDM().then((dm) => { dm.sendMessage(`:warning: This is your first and only warning!\nIf you do this again you will be blacklisted.\n**Moderator**: (Auto-Warning)\n**Trigger Word**: ${censorList[c]}`) }).catch(() => { return });
                } else {
                  user.blacklisted = true;
                  await user.save();
                  logs.sendMessage({
                    content: `**${message.author.username}** has been blacklisted from **Global Chat** by **(Auto-Blacklist)** for an offensive term.`
                 })
                  message.channel.sendMessage(`:x: <\\@${message.author.id}> has been blacklisted from Global Chat.\n**Moderator**: (Auto-Blacklist)\n**Reason**: Offensive Term`)
                  return await message.author?.openDM().then((dm) => { dm.sendMessage(`:x: You have been blacklisted from Global Chat.\n**Moderator**: (Auto-Blacklist)\n**Trigger Word**: ${censorList[c]}`) }).catch(() => { return });
                }
            }
          };
              let servers = await serverModel.find({ globalChatEnabled: true });
              global.cooldown.add(message.author.id);
              setTimeout(() => {
                cooldown.delete(message.author.id)
              }, 3000)
              if (logs) {
                logs.sendMessage({
                  content: `**User ID**: \`${message.author.id}\`\n**Server ID & Name**: \`${message.server.id}, ${message.server.name}\`\n**${message.author.username}**: ${message.content || "(Unknown)"}`
                })
              }
              servers.forEach(async (server) => {
                if (server.serverId == message.server.id) return;
                const channel = client.channels.get(server.globalChatChannel);
                if (message.server.havePermission("ManageRole")) {
                  const msg = await channel.sendMessage({
                    content: message.content,
                    masquerade: {
                        name: message.author?.username,
                        colour: message.member.hoistedRole ? message.member.hoistedRole.colour : "white",
                        avatar: message.author?.avatarURL
                     }
                   }).catch(() => { return });     
                } else {
                  const msg = await channel.sendMessage({
                    content: message.content,
                    masquerade: {
                      name: message.author?.username,
                      avatar: message.author?.avatarURL
                    }
                }).catch(() => { return });
              }
                 if (message.attachments) {
                  try {
                      message.attachments.map(a => {
                          https.get(a.url, async (sp) => {
                              channel.sendMessage({
                                  attachments: [await Uploader.upload(sp, a.filename || "Unknown")],
                                  masquerade: {
                                      name: message.author.username,
                                      avatar: message.author.avatarURL,
                                  }
                              }).catch(() => { })
                          });
                      })
                  } catch { }
              } 
          })
         } else return;
       } else {
        let args = message.content.split(" ");
        let command = args.shift().slice(prefix.length).toLowerCase();
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return;
          if (message.channel?.havePermission('SendMessage')) {
            data.commandsRan = data.commandsRan + 1;
            await data.save();
            await cmd.run(client, message, args)
            } else return;
           }
         } catch (error) {
      console.error(error);
    } 
	}, 
};