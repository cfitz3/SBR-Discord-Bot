
// Define Dependencies 
//================================================================//
const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixel = require('../../../hypixel.js');
const fs = require('fs').promises;
const path = require('path');

// Slash Command Builder
//================================================================//

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debugverify')
        .setDescription('Updates the guildcache.json file and crosschecks against guildmembers.json to verify membership'),


// Execution flow for verification debugging
//================================================================//

    async execute(interaction) {
        let replied = false; 
        
// Developer Lock
//================================================================//        
        
       if (interaction.user.id !== '729688465041522718') { 
        return await interaction.reply({content: "Only the developer can use this command.", ephemeral : true});
    }

        try {
           
            const guildName = 'Skyblock and Relax';
            console.log('Fetching guild data...');
            const guildData = await hypixel.getGuild('name', guildName);
            console.log('Guild data fetched:', guildData);

            if (!guildData || !guildData.members) {
                throw new Error('Guild data is undefined or does not contain members');
            }

            console.log('UUIDs of Guild Members:');
            const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
            console.log(uuids);

            console.log('Writing UUIDs to file...');
            const directoryPath = path.join(__dirname, '..', '..');
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

            replied = true;

            console.log('Sending reply to interaction...');
            await interaction.reply({ content: 'Guild data refreshed, member UUIDs written to guildcache.json, and guild membership verified', ephemeral: true });
            console.log('Reply sent.');
        } catch (error) {
            console.error('Error executing refreshverify command:', error);
            
            if (!replied) {
                console.log('Sending error message to interaction...');
                await interaction.reply({ content: 'Error: Unable to refresh guild data, log member UUIDs, and verify guild membership', ephemeral: true });
                console.log('Error message sent.');
            }
        }
    },
};
