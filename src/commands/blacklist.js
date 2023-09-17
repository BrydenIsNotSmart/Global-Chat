const Embed = require("../functions/embed");
const userModel = require("../database/models/user")

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    usage: "[userid] (reason)",
    category: "Mod-Only",
    description: "Blacklist a user from the globalchat.",
    async run(client, message, args) {
      try {
 message.channel.startTyping();
    if (!config.modids.includes(message.author.id)) {
        message.channel.stopTyping();
        return message.reply(":x: This is an mod only command.", false);
    }

     if (!args[0]) {
       message.channel.stopTyping();
       return message.reply(`:x: Please provide me a user to blacklist.`, false)
     } 
       const user = await client.users.fetch(args[0]).catch(() => {});
       if (!user) {
         message.channel.stopTyping();
         return message.reply(`:x: I couldn't find this user on Revolt.\n**Ussage**: \`gc!blacklist <userid> (reason)\``, false)
       }

      let userDb = await userModel.findOne({ userId: user.id });
      let logs = await client.channels.get(config.channels.globalLogs);
      if (!userDb) userDb = await userModel.create({ userId: user.id });

        if (userDb.blacklisted) {
         message.channel.stopTyping();
         return message.reply(`:x: This user is already blacklisted.`, false)
        }

       try {
        userDb.blacklisted = true;
        await userDb.save().then(async () => {
            message.channel.stopTyping();
          message.reply(`:white_check_mark: I have successfully blacklisted **${user.username}** from using Global Chat.`, false);

            logs.sendMessage({
               content: `**${user.username}** has been blacklisted from **Global Chat**.\n**Reason**: ${args[1] || "None Provided"}`
            })

          return await user?.openDM().then((dm) => { dm.sendMessage(`:x: You have been blacklisted from Global Chat.\n**Moderator**: ${message.author.username}\n**Reason**: ${args[1] || "None Provided"}`) }).catch(() => { return });
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