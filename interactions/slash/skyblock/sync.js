// Import Dependencies
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetchGuildInfo = require('../../../api/fetchguild.js');
const fs = require('fs').promises;
const path = require('path');

// Build Slash Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Verify that you are in the guild and sync your roles!'),

    // Execution flow for verification
    async execute(interaction) {
        let replied = false;

        try {
            const guildName = 'Skyblock and Relax';
            const guildData = await fetchGuildInfo(guildName);

            if (!guildData || !guildData.members) {
                throw new Error('Failed to fetch guild information! Please try again later.');
            }

            const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
            console.log(uuids);

            // Save UUIDs to database/guildcache.json
            const directoryPath = path.join(__dirname, '..', '..','..');
            const guildPath = path.join(directoryPath, 'database/guildcache.json');
            const userPath = path.join(directoryPath, 'database/guildmembers.json')

            try {
                const existingData = await fs.readFile(guildPath, 'utf-8');
                const existingUUIDs = JSON.parse(existingData);
                const newUUIDs = uuids.filter(uuid => !existingUUIDs.some(entry => entry.uuid === uuid.uuid));
                const updatedUUIDs = [...existingUUIDs, ...newUUIDs];

                if (newUUIDs.length > 0) {
                    await fs.writeFile(guildPath, JSON.stringify(updatedUUIDs, null, 2), 'utf-8');
                    console.log('UUIDs written to guildcache.json');
                }
            } catch (error) {
                // If guildcache.json does not exist, create it and write UUIDs
                await fs.writeFile(guildPath, JSON.stringify(uuids, null, 2), 'utf-8');
                console.log('UUIDs written to guildcache.json');
            }

            // Read the updated guildcache.json and user's data from guildmembers.json
            const updatedGuildData = await fs.readFile(guildPath, 'utf-8');
            const existingUserData = await fs.readFile(userPath, 'utf-8');

            const updatedGuildUUIDs = JSON.parse(updatedGuildData);
            const existingUserUUIDs = JSON.parse(existingUserData);

            const userId = interaction.user.id;

          // Check if the user's UUID is present in both files
            if (updatedGuildUUIDs.some(entry => entry.uuid === existingUserUUIDs[userId].uuid)) {
            console.log(`UUID found: ${existingUserUUIDs[userId].uuid}`); // Log the UUID

                // Add role to member
                const member = interaction.member;
                const role = interaction.guild.roles.cache.find(role => role.id === '1176586781861355651');

                if (member && role) {
                    await member.roles.add(role);
                }

                replied = true;

                // Send verification message
                await interaction.reply({ content: ` ${interaction.user.toString()} is now a verified member of Skyblock and Relax!`, ephemeral: true });
            } else {
                throw new Error('UUID not found in both files');
            }
        } catch (error) {
            console.error('Error executing refreshverify command:', error);
            
            if (!replied) {
                // Send error message if verification fails
                await interaction.reply({ content: `Failed to verify ${interaction.user.toString()}, please run /link and try again!`, ephemeral: true });
            }
        }
    },
};