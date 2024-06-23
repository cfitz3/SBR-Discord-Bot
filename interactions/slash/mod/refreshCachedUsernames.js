const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUsername } = require('../../../api/constants/mowojangAPI.js'); 
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshcachedusernames')
        .setDescription('Refresh the cached usernames of guild members'),

    async execute(interaction) {
        // Respond immediately
        await interaction.deferReply({ content: 'Updating usernames...', ephemeral: false });

        const membersPath= path.join(__dirname, '..', '..', '..', 'database/guildmembers.json');
        fs.readFile(membersPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            // Parse the JSON data
            const guildMembers = JSON.parse(data);

            // Loop through the guild members
            for (const id in guildMembers) {
                const member = guildMembers[id];
                const uuid = member.uuid;

                // Get the username for the UUID
                const username = await getUsername(uuid);

                // Update the JSON object with the username
                member.username = username;
            }

            // Write the updated JSON back to the file
            fs.writeFile(membersPath, JSON.stringify(guildMembers, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // Edit the initial response once the update process is complete
                interaction.editReply('Username update complete!');
            });
        });
    }
};