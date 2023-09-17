const Embed = require("../functions/embed");
const { readdirSync } = require("node:fs");
const path = require("node:path")
const serverModel = require("../database/models/server")

module.exports = {
  name: "help",
  category: "Info",
  aliases: ["commands"],
  description: "Some helpfull stuff on the bot.",
  async run(client, message, args) {

    const commands = client.commands.filter(c => c.name !== "help").map(c => `\`${c.name}\``);
    message.channel.startTyping();
    if (!args[0]) {
    const embed = new Embed()
      .setColor("#77b4d3")
      .setDescription(`## Help Menu\nType !help [command] to learn more about a command.\n### **Commands**:\n${commands.join(", ")}`)
      message.channel.stopTyping();
      return await message.reply({ embeds: [embed] }, false).catch(() => null);
    } else {  
    const data = await serverModel.findOne({ serverId: message.server.id });
    if(!data) await serverModel.create({ serverId: message.server.id })
    const prefix = config.bot.prefix;

    let catts = [];

    readdirSync(__dirname).forEach(() => {
      const commands = readdirSync(__dirname).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(path.join(__dirname, `${command}`));

        if (!file.name) return "No command name.";

        let name = file.name.replace(".js", "");

        let des = client.commands.get(name).description;

        let obj = {
          cname: `\`${name}\``,
          des,
        };

        return obj;
      });

      let dota = new Object();

      cmds.map((co) => {
        dota = {
          name: `${cmds.length === 0 ? "In progress." : co.cname}`,
          value: co.des ? co.des : "No Description",
          inline: true,
        };
        catts.push(dota);
      });

    });

    const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.find(
        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
      );


    if (!command) {
      const embed = new Embed()
        .setDescription(
          `Invalid command! Use \`${prefix}help\` for all of my commands!`
        )
        .setColor("#77b4d3");
        message.channel.stopTyping();
      return await message.reply({ embeds: [embed] }, false);
    }

    const embed = new Embed()
      .setDescription(`### **Command Details**\n#### **Command**:\n\`${command.name || "No name for this command." }\`\n#### **Aliases**:\n\`${command.aliases.join(", ") || "No aliases for this command." }\`\n#### **Usage**:\n \`${prefix}${command.name} ${command.usage || " "}\`\n#### **Description**: \n\`${command.description}\``)
      .setColor("#77b4d3");
      message.channel.stopTyping();
    return await message.reply({ embeds: [embed] }, false);
  }

    } 
};
