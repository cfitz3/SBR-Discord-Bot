const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

const membersPath= path.join(__dirname, '..', '..', '..', 'database/guildmembers.json');
const cachePath = path.join(__dirname, '..', '..', '..', 'database/guildcache.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checklink')
        .setDescription('Cross-check the guild members and cache data'),
    async execute(interaction) {

        // Read the guild members data
        const membersData = fs.readFileSync(membersPath, 'utf8');
        const membersObject = JSON.parse(membersData);

        // Convert the members object to an array and include the Discord ID
        const members = Object.entries(membersObject).map(([id, member]) => ({...member, id}));

        // Read the guild cache data
        const cacheData = fs.readFileSync(cachePath, 'utf8');
        const cacheObject = JSON.parse(cacheData);

        // Convert the cache object to an array and include the Discord ID
        const cache = Object.entries(cacheObject).map(([id, member]) => ({...member, id}));

        // Extract the member objects with uuid values from the members and cache data
        const memberObjects = members.map(member => ({uuid: member.uuid, username: member.username, id: member.id}));
        const cacheObjects = cache.map(member => ({uuid: member.uuid, username: member.username, id: member.id}));

        // Compare the uuid values
        const commonMembers = memberObjects.filter(member => cacheObjects.some(cacheMember => cacheMember.uuid === member.uuid));

        // Count the total number of members and the number of common members
        const totalMembers = cacheObjects.length;
        const commonMembersCount = commonMembers.length;

        // Create a string that contains all the information of the common members
        const descriptions = commonMembers.map(member => `**Discord ID:** <@${member.id}>\n=> Username: \`${member.username}\``);

        // Add the total common members to the descriptions
        descriptions.unshift(`**Total Linked Members** ${commonMembersCount}/${totalMembers}`);

        // Split the descriptions into chunks of 2048 characters (Discord's limit for embed description)
        const chunks = [];
        let currentChunk = '';

        descriptions.forEach(description => {
            if (currentChunk.length + description.length <= 768) {
                currentChunk += description + '\n';
            } else {
                chunks.push(currentChunk);
                currentChunk = description + '\n';
            }
        });

        // Push the last chunk
        if (currentChunk !== '') {
            chunks.push(currentChunk);
        }

       // Create an embed for each chunk
       const embeds = chunks.map((chunk, index) => {
        return new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle(`Linked Members (Page ${index + 1})`)
            .setDescription(chunk)
    });

    // Create the buttons
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
        );

    // Send the first embed with interaction.reply
    await interaction.reply({ embeds: [embeds[0]], components: [row], fetchReply: true });

    // Create a button collector
    const filter = i => i.customId === 'previous' || i.customId === 'next';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

    let currentIndex = 0;
    collector.on('collect', async i => {
        // Update the index
        if (i.customId === 'previous') {
            currentIndex = Math.max(currentIndex - 1, 0);
        } else {
            currentIndex = Math.min(currentIndex + 1, embeds.length - 1);
        }

        // Update the message with the new embed
        await i.update({ embeds: [embeds[currentIndex]], components: [row] });
    });
}
}