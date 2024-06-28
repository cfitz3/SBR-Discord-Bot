// Global array to store console messages
const consoleMessages = [];

// Override console.log to add messages to the array
const originalLog = console.log;
console.log = function (...args) {
    // Add the log message to the array
    consoleMessages.push(args.join(' '));
    // Call the original console.log function
    originalLog.apply(console, args);
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('print-console')
        .setDescription('Prints the content of the console to the server'),

    async execute(interaction) {
        // Check if the user is the developer
        if (interaction.user.id !== '729688465041522718') {
            return await interaction.reply({ content: "Only the developer can use this command.", ephemeral: true });
        }
        
        // Get the last 50 messages from the consoleMessages array
        const recentConsoleMessages = consoleMessages.slice(-50);

        // Format console messages
        const formattedMessages = recentConsoleMessages.map((message, index) => `${index + 1}. ${message}`);

        // Send formatted console messages to the server
        await interaction.reply({ content: formattedMessages.join('\n') });
    },
};
