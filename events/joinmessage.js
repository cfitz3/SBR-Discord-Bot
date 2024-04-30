const { Client, Intents } = require('discord.js');
const { channelId, welcomeMessage } = require('../config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    // Customize the welcome message with the member's username
    const greeting = welcomeMessage.replace('{username}', member.user.username);

    channel.send({ content: `${member.user}, ${greeting}` });
});

client.login('YOUR_BOT_TOKEN');
