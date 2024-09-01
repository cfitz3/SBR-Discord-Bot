const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, EmbedBuilder, ButtonStyle } = require(`discord.js`);

const modHelpMenu = new EmbedBuilder()
    .setColor(0xFF69B4)
    .setTitle('Admin Menu')
    .setAuthor({ name: 'SBR Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
    .setDescription(`Welcome to the Administrator control panel! Don't fuck anything up!`)
    .setTimestamp()
    .setFooter({ text: 'If anything breaks let me know ASAP- WIther' })

/*
const syncHelpButton = new ButtonBuilder()
    .setCustomId('syncHelpButton')
    .setLabel('Verify Help')
    .setStyle(ButtonStyle.Success);

const linkHelpButton = new ButtonBuilder()
        .setCustomId('linkHelpButton')
        .setLabel('Link Help')
        .setStyle(ButtonStyle.Success);
*/

const restartGuildButton = new ButtonBuilder()
        .setCustomId('restartGuildButton')
        .setLabel('Restart Guild Bot')
        .setStyle(ButtonStyle.Danger);

const manualGuildRefreshButton = new ButtonBuilder()
        .setCustomId('manualGuildRefreshButton')
        .setLabel('Refresh Guild Data')
        .setStyle(ButtonStyle.Success);

const ticketsLinkButton = new ButtonBuilder()
        .setLabel('Ticket Dashboard')
        .setURL(`http://195.201.242.60:8169/settings/1176585490636488794`)
        .setStyle(ButtonStyle.Link);

const startJobsButton = new ButtonBuilder()
        .setCustomId('startJobsButton')
        .setLabel('Start Jobs')
        .setStyle(ButtonStyle.Success);

        const helpRow = new ActionRowBuilder()
            .addComponents(manualGuildRefreshButton, ticketsLinkButton, restartGuildButton, startJobsButton );
             

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modmenu')
        .setDescription('Mod Command. Sends a help embed for linking Discord accounts on Hypixel.'),

    async execute(interaction) {
        await interaction.reply({
            embeds: [modHelpMenu],
            components: [helpRow],
            ephemeral: true
        });
    },
};