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
                    .setDescription('Pricing Information for Slayer Carries')
                    .setValue('slayer'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Dungeons')
                    .setDescription('Pricing Information for Dungeon Carries')
                    .setValue('dungeons'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Master Mode')
                    .setDescription('Pricing Information for Master Mode Carries')
                    .setValue('master_mode'),
            );

        // Build the example embed
        const exampleEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('Carry Information:')
            .setAuthor({ name: 'Skyblock and Relax', iconURL: 'https://i.imgur.com/eboO5Do.png' })
            .setDescription('Pricing information and a list of available carry services can be seen below using the dropdown menu! If you have any questions or would like to buy a carry, please feel free to open a ticket!')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '<:f7:1235704894732767263> Dungeon Carries', value: 'Pricing Information for Dungeon Carries (Floor 4-Floor 7).', inline: true },
                { name: '<:mm7:1235704840819183766> Master Mode Carries', value: 'Pricing Information for Master Mode Carries (MM1-MM6).', inline: true },
            )
            .addFields({ name: '<:batphone:1235704806274760745> Slayer Carries', value: 'Pricing Information for Slayer Carries (Voidgloom T4 | Rev T5).', inline: true })
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
