const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('carrymenu')
        .setDescription('Sends the SBR Carry menu in the current chat.'),
    async execute(interaction) {
        // Define the select menu options
        const select = new StringSelectMenuBuilder()
            .setCustomId('carries')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Slayer')
                    .setDescription('Pricing/Carrier Information for Slayer Carries')
                    .setValue('slayer'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Dungeons')
                    .setDescription('Pricing/Carrier Information for Dungeon Carries')
                    .setValue('dungeons'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Master Mode')
                    .setDescription('Pricing/Carrier Information for Master Mode Carries')
                    .setValue('master mode'),
            );

        // Build the example embed
        const exampleEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('Carry Information:')
            .setAuthor({ name: 'Skyblock and Relax', iconURL: 'https://i.imgur.com/eboO5Do.png' })
            .setDescription('blah blah blah information about carries in the dropdown menu blah blah blah select an option to see more!')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Dungeon Carries', value: 'Information about dungeon carries below.', inline: true },
                { name: 'Master Mode Carries', value: 'Information about master mode carries below.', inline: true },
            )
            .addFields({ name: 'Slayer Carries', value: 'Information about slayer carries below.', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Need help? Open a ticket in #support or contact @withercloak' });

        // Send the initial message with the select menu and embed
        await interaction.reply({
            content: 'What would you like to learn more about?',
            embeds: [exampleEmbed],
            components: [
                {
                    type: 1, // Row type
                    components: [
                        select,
                    ],
                },
            ],
        });
    },
};
