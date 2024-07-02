const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserCredits } = require('../../../contracts/credits.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkcredits')
    .setDescription('Check your current credit balance.'),

  async execute(interaction) {
    try {
      const credits = await getUserCredits(interaction);
      await interaction.reply({ content: `Your current credit balance is: ${credits}`, ephemeral: true });
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
      await interaction.reply({ content: 'There was an error fetching your credit balance.', ephemeral: true });
    }
  }
};