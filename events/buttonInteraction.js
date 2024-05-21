const { Events, EmbedBuilder } = require('discord.js');
const { syncHelp, linkHelp } = require('../responses/embeds/modHelp.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isButton()) {
      if (interaction.customId === 'syncHelpButton') {
        await interaction.reply({ embeds: [syncHelp] });

      } else if (interaction.customId === 'linkHelpButton') {
        await interaction.reply({ embeds: [linkHelp] });

      } else if(interaction.customId === 'verifyButton'){
        await interaction.reply({ content: 'You clicked the verify button!', ephemeral: true });
      }
    
    }
	},
};