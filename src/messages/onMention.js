const { config } = require("../../config.json");

module.exports = {
	 
	// @param {import('discord.js').Message} message The Message Object of the command.
	 
	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${config.bot.prefix}\`, get help by \`${config.bot.prefix}help\``
		);
	},
};
