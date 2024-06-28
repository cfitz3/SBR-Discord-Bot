module.exports = {
    name: ['abreadstick109', 'clerk'],
    cooldown: 5,
    execute(message, args) {
        // Check if the trigger word is "abreadstick109"
        if (message.content.toLowerCase().includes('abreadstick109')) {
            // Send a response
            message.channel.send({
                content: "imagine winning 250 million coins already wtf",
            });

        // Check if the trigger word is "wither"
        } else if (message.content.toLowerCase().includes('clerk')) {
            // Send a different response for "wither"
            message.reply('ur bald');

        // Check if the trigger word is "hey"
        } else if (message.content.toLowerCase().includes('null')) {
            // Send another response for "hey"
            message.channel.send({
                content: "Hey! How can I help you?",
            });
        }
    },
};
