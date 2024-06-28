const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inactives')
        .setDescription('Cross-check the guild members and cache data'),
    async execute(interaction) {
        try {
            const inactivecache = path.join(__dirname, '..', '..','..', 'database', 'inactivemembers.json');
            const data = await fs.readFile(inactivecache, 'utf8');
            
            let inactivemembers = JSON.parse(data);

            // If inactivemembers is not an array, make it an array
            if (!Array.isArray(inactivemembers)) {
                inactivemembers = [inactivemembers];
            }

            // Create an embed for each inactive member
            const embeds = inactivemembers.map(member => {
                return new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle(`Inactive Member: ${member.discord}`)
                    .addFields(
                        { name: 'Reason', value: member.reason },
                        { name: 'Expiration', value: member.expiration_formatted }
                    )
                    .setTimestamp();
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
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setLabel('Exit')
                        .setStyle(ButtonStyle.Danger)
                );

            // Send the first embed with interaction.reply
            await interaction.reply({ embeds: [embeds[0]], components: [row], fetchReply: true });

            // Create a button collector
            const filter = i => ['previous', 'next', 'exit'].includes(i.customId);
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

            let currentIndex = 0;
            collector.on('collect', async i => {
                if (i.customId === 'exit') {
                    await i.update({ components: [] });
                    collector.stop();
                } else {
                    // Update the index
                    if (i.customId === 'previous') {
                        currentIndex = Math.max(currentIndex - 1, 0);
                    } else {
                        currentIndex = Math.min(currentIndex + 1, embeds.length - 1);
                    }

                    // Update the message with the new embed
                    await i.update({ embeds: [embeds[currentIndex]], components: [row] });
                }
            });
        } catch (err) {
            console.error(err);
            interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    }
}