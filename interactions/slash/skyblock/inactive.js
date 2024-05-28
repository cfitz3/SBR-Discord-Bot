const { SlashCommandBuilder } = require('discord.js');
const inactivityNotice = require('../../modals/category/inactiveNotice.js'); // adjust the path to your actual modal file

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inactivity')
        .setDescription('Send an inactivity notice to the guild staff'),
    async execute(interaction) {
        await inactivityNotice.execute(interaction);
    },
};