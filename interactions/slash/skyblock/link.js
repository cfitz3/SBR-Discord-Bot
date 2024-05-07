// Import Dependencies
const fs = require('fs').promises;
const path = require('path');
const hypixel = require('../../../hypixel.js');
const { SlashCommandBuilder, EmbedBuilder, embedLength } = require("discord.js");


// Build the example embed
    const linkHelp = new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle('Your linked Discord account on Hypixel does not match your Discord ID!')
        .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
        .setDescription(':no_entry_sign: Oh no! It seems your Discord account is not linked on Hypixel. Join Hypixel and follow the steps below to fix this.')
        .addFields({ name: ':recycle: Linking your Discord Account:', value: 'Follow these steps to link your account:\n\n1. Click on `My Profile` (Right Click) in a Hypixel lobby\n2. Click on `Social Media`\n3. Left-click on `Discord`\n4. Paste your Discord username in chat', inline: true })
        .setTimestamp()
        .setFooter({ text: 'Need help? Open a ticket in #support or contact @withercloak' });


// Create Slash Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord account with our bot.')
        .addStringOption(option =>
            option.setName('player_name')
                .setDescription('Your Minecraft username.')
                .setRequired(true)),


    // Execution Flow for Player Link
    async execute(interaction) {
        try {
            const playerName = interaction.options.getString('player_name');
            const player = await hypixel.getPlayer(playerName).catch(console.error);

            if (!player) {
                return interaction.reply({ content: 'Your Discord account is not linked!', embeds: [linkHelp], ephemeral: true });
            }

            const discordLink = player.socialMedia.find(s => s.id === 'DISCORD');
            if (!discordLink || discordLink.link !== interaction.user.tag) {
                return interaction.reply({ content: "", embeds: [linkHelp], ephemeral: false });
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

            // Add the role to the member if their highest role position is lower than ROLEID
            const roleName = "1223804019030360216"; // Replace ROLEID with the actual ID of the role
            const member = interaction.member;
            const guildRoles = interaction.guild.roles.cache;
            const targetRole = guildRoles.find(role => role.id === roleName);

            if (!targetRole) {
                return interaction.reply({ content: `Error: Role with ID ${roleName} not found!`, ephemeral: true });
            }

            const userHighestRole = member.roles.highest;

            if (userHighestRole.comparePositionTo(targetRole) < 0) {
                await member.roles.add(targetRole);
            }

            await interaction.reply({ content: "Your Discord account has been linked successfully!", ephemeral: true });
        } catch (error) {
            console.error('Error checking player information:', error);
            await interaction.reply({ content: `Error: Unable to fetch player data`, ephemeral: true });
        }
    },
};
