const Revolt = require('revolt.js');
const RevoltBots = require('revoltbots.js');
const rbl = new RevoltBots.Client(config.bot.rblApiKey);

module.exports = {
	name: "ready",
	execute(client) {
		console.info(`[INFO] ${client.user.username} is logged in and ready.`)
		client.api.patch("/users/@me", { status: { text: `Powering your conversations.`, presence: "Online" } });

		rbl.postStats(client)
	},
};