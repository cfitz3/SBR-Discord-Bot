const { Client, GatewayIntentBits } = require('discord.js');
const { token, channelId } = require('../../config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers, // Required to receive member join events
        GatewayIntentBits.GuildMessages // Required to send messages
    ]
});

client.on('guildMemberAdd', async (member) => {
    console.log(`New member joined: ${member.user.tag}`);
    try {
        const channel = member.guild.channels.cache.get(channelId);
        if (channel && channel.isText()) {
            console.log(`Sending welcome message to ${member.user.tag}`);
            // Send an ephemeral message to the new user
            await member.send({
                content: `Welcome to the server, ${member.toString()}! Enjoy your stay.`
            });
            // Notify in the specified channel
            await channel.send({
                content: `🎉 Welcome to the server, ${member.toString()}!`,
                ephemeral: true // Send as an ephemeral message visible only to the user
            });
        } else {
            console.error('Channel not found or not a text channel.');
        }
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});


