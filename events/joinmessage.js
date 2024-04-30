const { Client, Intents } = require('discord.js');
const { channelId, welcomeMessage, token } = require('../config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const greeting = welcomeMessage.replace('{username}', member.user.username);

    channel.send({ content: `${member.user}, ${greeting}` });
});

client.login(token);
