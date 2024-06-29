const { Events } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a select menu interaction
        if (!interaction.isStringSelectMenu()) return;

        // Check which option was selected
        const selectedOption = interaction.values[0];

        // Read the response from the corresponding JSON file
        const filePath = `./src/responses/${selectedOption}.json`;
        let response;
        try {
            response = JSON.parse(fs.readFileSync(filePath, "utf8")).response;
        } catch (error) {
            console.error(error);
            response = 'Invalid selection.';
        }

        // Reply to the interaction with the response
        await interaction.reply({
            content: response,
            ephemeral: true,
        });
    },
};