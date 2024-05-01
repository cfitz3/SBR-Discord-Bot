const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('printfile')
        .setDescription('Prints the contents of a JSON file to the channel')
        .addStringOption(option =>
            option.setName('filename')
                .setDescription('Enter the filename of the JSON file.')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user is the developer
        if (interaction.user.id !== '729688465041522718') {
            return await interaction.reply({ content: 'Only the developer can use this command.', ephemeral: true });
        }
       
        // Get the filename provided by the user
        const fileName = interaction.options.getString('filename');

        try {
            // Determine the root directory of the bot's project
            const rootDir = path.resolve(__dirname, '../../../');

            // Construct the file path
            const filePath = path.join(rootDir, fileName);

            // Read the contents of the JSON file
            const jsonData = await fs.readFile(filePath, 'utf-8');

            // Parse the JSON data
            const data = JSON.parse(jsonData);

            // Convert JSON data to string
            const jsonString = JSON.stringify(data, null, 2);

            // Split the string into chunks less than 2000 characters
            const chunkSize = 2000;
            const chunks = [];
            for (let i = 0; i < jsonString.length; i += chunkSize) {
                chunks.push(jsonString.substring(i, i + chunkSize));
            }

            // Send each chunk to the channel
            for (const chunk of chunks) {
                await interaction.reply({ content: `\`\`\`json\n${chunk}\n\`\`\``, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while reading or parsing the JSON file.', ephemeral: true });
        }
    },
};
