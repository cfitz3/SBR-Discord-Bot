// Import Dependencies
const fs = require('fs').promises;
const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const fetchPlayerInfo = require('../../../api/fetchplayer.js');
const {linkHelp} = require('../../../responses/embeds/linkhelp.js');
const {guestRole} = require('../../../config.json');

// Create Slash Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('linktest')
        .setDescription('Link your Discord account with our bot.')
        .addStringOption(option =>
            option.setName('player_name')
                .setDescription('Your Minecraft username.')
                .setRequired(true)),
            
                    // Execution Flow for Player Link
                    async execute(interaction) {
                        try {
                            // Get the player name from the interaction options
                            const playerName = interaction.options.getString('player_name');
                    
                            // Fetch player information from the API
                            let player;
                            try {
                                player = await fetchPlayerInfo(playerName);
                            } catch (error) {
                                console.error('Error fetching player information:', error);
                                return interaction.reply({ content: 'An error occurred while fetching your player information. Please try again later.', ephemeral: true });
                            }
                    
                            if (!player) {
                                // If player information is not found, reply with an error message and link help embed
                                return interaction.reply({ content: 'Oopsie!', embeds: [linkHelp], ephemeral: true });
                            }
                    
                            // Check if the player's Discord account is linked
                            const discordLink = player.socialMedia.find(s => s.id === 'DISCORD');
                            if (!discordLink || discordLink.link !== interaction.user.tag) {
                                // If the player's Discord account is not linked, reply with an error message and link help embed
                                return interaction.reply({ content: "Oopsie!", embeds: [linkHelp], ephemeral: true });
                            }
                    
                            // Check if the player has a guild
                    
    
                            // Path to the file storing user data
                            const userDataFilePath = path.join(__dirname, '..', '..', '..', 'database/guildmembers.json');
                            let userData = {};

                            try {
                                // Read the user data from the file
                                const guildMembersData = await fs.readFile(userDataFilePath, 'utf8');
                                userData = JSON.parse(guildMembersData);
                            } catch (error) {
                                console.error('Error reading the Guild Database:', error);
                            }

                            const userId = interaction.user.id;

                            if (userData[userId]) {
                                // Update the user's UUID if it already exists in the user data
                                userData[userId].uuid = player.uuid;
                            } else {
                                // Add a new entry for the user in the user data
                                userData[userId] = {
                                    username: interaction.user.username,
                                    uuid: player.uuid
                                };
                            }

                            // Write the updated user data to the file
                            await fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2));

                            // Add a role to the member if their highest role position is lower than ROLEID 
                            const member = interaction.member;
                            const guildRoles = interaction.guild.roles.cache;
                            const targetRole = guildRoles.find(role => role.id === guestRole);

                            if (!targetRole) {
                                // If the target role is not found, reply with an error message
                                return interaction.reply({ content: `Error: Role not found!`, ephemeral: true });
                            }

                            const userHighestRole = member.roles.highest;

                            if (userHighestRole.comparePositionTo(targetRole) < 0) {
                                // Add the target role to the member if their highest role position is lower
                                await member.roles.add(targetRole);
                            }

                            // Reply with a success message
                            await interaction.reply({ content: "Your Discord account has been linked successfully!", ephemeral: true });
                        } catch (error) {
                            console.error('Error checking player information:', error);
                            // Reply with an error message if there is an error fetching player data
                            await interaction.reply({ content: `Error: Unable to fetch player data`, ephemeral: true });
                        
                        }
                    },
                };
             