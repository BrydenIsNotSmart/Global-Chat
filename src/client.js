const { Client, API } = require('revolt.js');
const { Collection } = require('@discordjs/collection')
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const client = new Client();
const fs = require('node:fs');
const path = require('node:path');
const cooldown = new Set();
global.cooldown = cooldown;
global.client = client;

//-Events-//
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
		client.on(event.name, (...args) => event.execute(...args, client));
}

//-Commands-//
client.commands = new Collection();
client.aliases = new Collection();
const getFiles = (path) => readdirSync(join(__dirname, path)).filter((file) => file.endsWith(".js"));
for (const cfile of getFiles("commands")) {
	const command = require(join(__dirname, "commands", `${cfile}`));
	client.commands.set(command.name, command);
	if (command.aliases) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
}

client.loginBot(config.bot.token)