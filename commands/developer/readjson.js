const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'printjson',
    type: "General",
    description: 'Prints the contents of a JSON file to the channel',
    cooldown: 3,
    async execute(message, args) {
         // Check if the user is the developer
         if (message.author.id !== '729688465041522718') {
            return message.channel.send("Only the developer can use this command.");
        }
       
        // Check if a filename is provided
        if (!args.length) {
            return message.channel.send("Please provide the filename!");
        }

        try {
            // Determine the root directory of the bot's project
            const rootDir = path.resolve(__dirname, '../../');

            // Construct the file path
            const fileName = args[0];
            const filePath = path.join(rootDir, fileName);

            // Read the contents of the JSON file
            const jsonData = await fs.readFile(filePath, 'utf-8');

            // Parse the JSON data
            const data = JSON.parse(jsonData);

            // Convert JSON data to string
            const jsonString = JSON.stringify(data, null, 2);

            // Split the string into chunks less than 1600 characters
            const chunkSize = 1600;
            const chunks = [];
            for (let i = 0; i < jsonString.length; i += chunkSize) {
                chunks.push(jsonString.substring(i, i + chunkSize));
            }

            // Send each chunk to the channel
            for (const chunk of chunks) {
                await message.channel.send(`\`\`\`json\n${chunk}\n\`\`\``);
            }
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reading or parsing the JSON file.`);
        }
    },
};
