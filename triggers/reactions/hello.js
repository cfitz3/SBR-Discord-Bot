/**
 * @file Sample Trigger command.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.2.2
 */

// For now, the only available property is name array. Not making the name array will result in an error.

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
    name: ['abreadstick109', 'clerk', 'null'],

    execute(message, args) {
        // Check if the trigger word is "abreadstick109"
        if (message.content.toLowerCase().includes('abreadstick109')) {
            // Send a response
            message.channel.send({
                content: "imagine winning 200 million coins already wtf",
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
