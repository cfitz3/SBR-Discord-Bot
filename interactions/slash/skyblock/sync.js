// Import Dependencies
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetchGuildInfo = require('../../../api/functions/fetchGuildInfo.js');
const fs = require('fs').promises;
const path = require('path');

const basePath = path.join(__dirname, '..', '..', '..', 'database');
const guildPath = path.join(basePath, 'guildcache.json');
const userPath = path.join(basePath, 'guildmembers.json');

// Build Slash Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Verify that you are in the guild and sync your roles!'),

    // Execution flow for verification
    async execute(interaction) {
        try {
            const guildData1 = await fetchGuildInfo('Skyblock and Relax');
            const guildData2 = await fetchGuildInfo('Skyblock and Relax Plus'); // Replace with the second guild's name

            if (!guildData1 || !guildData1.members || !guildData2 || !guildData2.members) {
                throw new Error('Failed to fetch guild information! Please try again later.');
            }

            // Combine members from both guilds
            const combinedMembers = [...guildData1.members, ...guildData2.members];
            const uuids = combinedMembers.map(member => ({ uuid: member.uuid }));

            // Save UUIDs to database/guildcache.json
            try {
                await fs.writeFile(guildPath, JSON.stringify(uuids, null, 2), 'utf-8');
            } catch (error) {
                // If guildcache.json does not exist, create it and write UUIDs
                await fs.writeFile(guildPath, JSON.stringify(uuids, null, 2), 'utf-8');
            }

            // Read the updated guildcache.json and user's data from guildmembers.json
            const updatedGuildData = await fs.readFile(guildPath, 'utf-8');
            const existingUserData = await fs.readFile(userPath, 'utf-8');

            const updatedGuildUUIDs = JSON.parse(updatedGuildData);
            const existingUserUUIDs = JSON.parse(existingUserData);

            const userId = interaction.user.id;

            // Check which guild the user belongs to
            let guildName = null;
            let role = null;

            if (guildData1.members.some(member => member.uuid === existingUserUUIDs[userId].uuid)) {
                guildName = 'Skyblock and Relax';
                role = interaction.guild.roles.cache.find(role => role.id === '1176586781861355651'); // Role ID for Skyblock and Relax
            } else if (guildData2.members.some(member => member.uuid === existingUserUUIDs[userId].uuid)) {
                guildName = 'Skyblock and Relax Plus';
                role = interaction.guild.roles.cache.find(role => role.id === '1254105617069510728'); // Replace with the role ID for the second guild
            }

            if (guildName && role) {
                // Add role to member
                const member = interaction.member;

                if (member && role) {
                    await member.roles.add(role);

                }
                
                if ( member && role) {
                    // Remove specific role if present
                    const roleToRemove = interaction.guild.roles.cache.find(role => role.id === '1223804019030360216'); // Replace with the role ID to remove
                    const member = interaction.member;
    
                    if (member && roleToRemove && member.roles.cache.has(roleToRemove.id)) {
                        await member.roles.remove(roleToRemove);
                    }
                }

                // Send verification message
                await interaction.reply({ content: ` ${interaction.user.toString()} is now a verified member of ${guildName}!`, ephemeral: true });
            } else {
                throw new Error('UUID not found in both files');
            }
        } catch (error) {
            console.error('Error executing sync command:', error);
            // Send error message if verification fails
            await interaction.reply({ content: `Failed to verify ${interaction.user.toString()}, please run /link and try again!`, ephemeral: true });
        }
    }
};
