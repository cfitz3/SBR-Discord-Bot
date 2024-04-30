
// Define Dependencies 
//================================================================//

const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixel = require('../../../hypixel.js');
const fs = require('fs').promises;
const path = require('path');


//Slash Command Builder
//================================================================//

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshguild')
        .setDescription('Manually refresh the guildcache.json file and update it with the UUIDs of any new guild members'),

    async execute(interaction) {
        
// Developer Lock
//================================================================//
        
        if (interaction.user.id !== '729688465041522718') {
        return await interaction.reply({content: "Only the developer can use this command.", ephemeral : true});
    }

// Execution flow for database refresh
//================================================================//

        try {
            
            const guildName = 'Skyblock and Relax';
            const guildData = await hypixel.getGuild('name', guildName);

            if (!guildData || !guildData.members) {
                throw new Error('Guild data is undefined or does not contain members');
            }

            console.log('UUIDs of Guild Members:');
            const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
            console.log(uuids);

            const directoryPath = path.join(__dirname, '..', '..', '..');
            const filePath = path.join(directoryPath, 'guildcache.json');

            try {
        
                const existingData = await fs.readFile(filePath, 'utf-8');
                const existingUUIDs = JSON.parse(existingData);
                const newUUIDs = uuids.filter(uuid => !existingUUIDs.some(entry => entry.uuid === uuid.uuid));
                const updatedUUIDs = [...existingUUIDs, ...newUUIDs];

                if (newUUIDs.length > 0) {
                    await fs.writeFile(filePath, JSON.stringify(updatedUUIDs, null, 2), 'utf-8');
                    console.log('UUIDs written to guildcache.json');
                }
            } catch (error) {
            
                await fs.writeFile(filePath, JSON.stringify(uuids, null, 2), 'utf-8');
                console.log('UUIDs written to guildcache.json');
            }

        
            await interaction.reply({ content: 'Guild data refreshed and member UUIDs written to guildcache.json', ephemeral: true });
        } catch (error) {
            console.error('Error refreshing guild data:', error);
            await interaction.reply({ content: 'Error: Unable to refresh guild data', ephemeral: true });
        }
    },
};
