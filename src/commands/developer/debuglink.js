const {config} = require('../../../config.json');
const hypixel = require('../../api/constants/hypixel.js');

module.exports = {
    name: "debuglink",
    description: "Runs the base link command and returns the process checks", 

    async execute(message, args) {
        if (!message.content.startsWith(config.bot.prefix + "debuglink")) return;

        // Check if the user is the developer
        if (message.author.id !== '729688465041522718') {
            return message.channel.send("Only the developer can use this command.");
        }
        
        try {
            if (!args.length) {
                return message.channel.send("Please provide a player name.");
            }

            const playerName = args[0];
            const player = await hypixel.getPlayer(playerName).catch(console.error);

            if (!player) {
                return message.channel.send(`Player ${playerName} does not exist.`);
            }

            // Check for Discord link
            const discordLink = player.socialMedia.find(s => s.id === 'DISCORD');
            const discordTag = message.author.tag;
            const discordLinkMatch = discordLink && discordLink.link === discordTag;

            // Output debugging information as messages
            message.channel.send(`Player: ${playerName}`);
            message.channel.send(`Discord link: ${JSON.stringify(discordLink)}`);
            message.channel.send(`Discord tag: ${discordTag}`);
            message.channel.send(`Discord link match: ${discordLinkMatch}`);

            if (!discordLinkMatch) {
                return message.channel.send("Your Discord link on Hypixel does not match your current Discord!");
            }

            // If all checks pass, send success message
            message.channel.send(`Player ${playerName} has been linked successfully!`);
        } catch (error) {
            console.error('Error checking player information:', error);
            message.channel.send(`Error: Unable to fetch player data`);
        }
    }
}
