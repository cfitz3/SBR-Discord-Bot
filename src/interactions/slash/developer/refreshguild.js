const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixel = require('../../../api/constants/hypixel.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshguild')
        .setDescription('Manually refresh the guildcache.json file and update it with the UUIDs of any new guild members'),

    async execute(interaction) {
        
// Developer Lock
        
        if (interaction.user.id !== '729688465041522718') {
        return await interaction.reply({content: "Only the developer can use this command.", ephemeral : true});
    }

// Execution flow for database refresh

        try {
            
            const guildName = 'Skyblock and Relax';
            const guildData = await hypixel.getGuild('name', guildName);

            if (!guildData || !guildData.members) {
                throw new Error('Guild data is undefined or does not contain members');
            }

            const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
            
            const filePath = path.join(__dirname, '..', '..', '..', 'database/guildcache.json');

            console.log('Writing to file:', filePath);
            console.log('Data:', JSON.stringify(uuids, null, 2));

            // Write the fetched data to the file, overwriting any existing data

            await fs.writeFile(filePath, JSON.stringify(uuids, null, 2), 'utf-8');
            console.log('UUIDs written to guildcache.json');

            await interaction.reply({ content: 'Guild data refreshed and member UUIDs written to guildcache.json', ephemeral: true });
        } catch (error) {
            console.error('Error refreshing guild data:', error);
            await interaction.reply({ content: 'Error: Unable to refresh guild data', ephemeral: true });
        }
    },
};