// Import Dependencies
//================================================================//

const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixel = require('../../../hypixel.js');
const fs = require('fs').promises;
const path = require('path');

// Build Slash Command
//================================================================//

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify that you are in the guild and sync your roles!'),

// Execution flow for verification        
//================================================================//

    async execute(interaction) {
        let replied = false;

        try {
            const guildName = 'Skyblock and Relax';
            const guildData = await hypixel.getGuild('name', guildName);

            if (!guildData || !guildData.members) {
                throw new Error('Guild data is undefined or does not contain members');
            }

            console.log('UUIDs of Guild Members:');
            const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
            console.log(uuids);

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

              const member = interaction.member;
              const role = interaction.guild.roles.cache.find(role => role.id === '1176586781861355651');
  
              if (member && role) {
                  await member.roles.add(role);
              }
  

            replied = true;

            await interaction.reply({ content: ` ${interaction.user.toString()} is now a verified member of Skyblock and Relax!`, ephemeral: true });
        } catch (error) {
            console.error('Error executing refreshverify command:', error);
            
            if (!replied) {
                await interaction.reply({ content: `Failed to verify ${interaction.user.toString()}, please run /link and try again!`, ephemeral: true });
            }
        }
    },
};