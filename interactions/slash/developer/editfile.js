const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editjson')
        .setDescription('Edit a JSON file with provided data')
        .addStringOption(option =>
            option.setName('filename')
                .setDescription('Enter the filename of the JSON file.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('data')
                .setDescription('Enter the data to be written to the JSON file.')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has the developer role
        if (!interaction.member.roles.cache.has('1176586194373595156')) {
            return await interaction.reply({ content: 'You must be a developer to use this command.', ephemeral: true });
        }

        // Get filename and data provided by the user
        const fileName = interaction.options.getString('filename');
        const userData = interaction.options.getString('data');

        try {
            // Construct the formatted JSON data
            const formattedData = `{ "response": "${userData}" }`;

            // Determine the root directory of the bot's project
            const rootDir = path.resolve(__dirname, '../../..');

            // Construct the file path
            const filePath = path.join(rootDir, fileName);

            // Write the formatted JSON data to the file
            await fs.writeFile(filePath, formattedData, 'utf-8');

            // Respond to the user
            await interaction.reply({ content: `Data has been successfully written to ${fileName}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while writing to the JSON file.', ephemeral: true });
        }
    },
};
