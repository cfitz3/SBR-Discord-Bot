const { prefix } = require("../config.json");

module.exports = {
	 
	// @param {import('discord.js').Message} message The Message Object of the command.
	 
	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\``
		);
	},
};
