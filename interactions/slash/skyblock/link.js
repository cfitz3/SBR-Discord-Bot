
//Import Dependencies
//================================================================//

const fs = require('fs').promises;
const path = require('path');
const hypixel = require('../../../hypixel.js');
const { SlashCommandBuilder } = require("discord.js");

//Create Slash Command
//================================================================//

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord account with our bot.')
        .addStringOption(option =>
            option.setName('player_name')
                .setDescription('Your Minecraft username.')
                .setRequired(true)),

//Execution Flow for Player Link
//================================================================//

    async execute(interaction) {
        try {
            const playerName = interaction.options.getString('player_name');
            const player = await hypixel.getPlayer(playerName).catch(console.error);

            if (!player) {
                return interaction.reply({ content: `Player ${playerName} does not exist.`, ephemeral: true });
            }

            const discordLink = player.socialMedia.find(s => s.id === 'DISCORD');
            if (!discordLink || discordLink.link !== interaction.user.tag) {
                return interaction.reply({ content: "Your linked Discord account on Hypixel does not match your Discord ID!", ephemeral: true });
            }

            const userDataFilePath = path.join(__dirname, '..', '..', '..', 'guildmembers.json');
            let userData = {};

            try {
                const guildMembersData = await fs.readFile(userDataFilePath, 'utf8');
                userData = JSON.parse(guildMembersData);
            } catch (error) {
                console.error('Error reading guildmembers.json:', error);
            }

            const userId = interaction.user.id;

            if (userData[userId]) {
                userData[userId].uuid = player.uuid;
            } else {
                userData[userId] = {
                    username: interaction.user.username,
                    uuid: player.uuid
                };
            }

            await fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2));
            
            await interaction.reply({ content: "Your Discord account has been linked successfully!", ephemeral: true });
        } catch (error) {
            console.error('Error checking player information:', error);
            await interaction.reply({ content: `Error: Unable to fetch player data`, ephemeral: true });
        }
    },
};
