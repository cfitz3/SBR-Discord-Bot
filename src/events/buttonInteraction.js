const { Events } = require('discord.js');
const { syncHelp, linkHelp, forumLinks, forumOops } = require('../responses/embeds/adminHelp.js');
const refreshGuildData = require('../api/functions/refreshGuildMembers.js');
const { bumpPost } = require('../jobs/bumpPost.js');
const { incrementUserCredit } = require('../contracts/credits.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isButton()) {
        if (interaction.customId === 'syncHelpButton') {
          await interaction.reply({ embeds: [syncHelp] });

        } else if (interaction.customId === 'linkHelpButton') {
          await interaction.reply({ embeds: [linkHelp] });

        } else if(interaction.customId === 'restartGuildButton'){
          await interaction.reply({ content: 'Restarting the bot...', ephemeral: true });
          process.exit();
        
        } else if(interaction.customId === 'manualGuildRefreshButton'){
          await refreshGuildData(interaction);
      
        } else if(interaction.customId === 'startJobsButton'){
          const client = interaction.client;
          await bumpPost(client); 
          await interaction.reply({ content: 'Starting Jobs...', ephemeral: true });
        
        } else if (interaction.customId === 'sbr_bump') {
          const awarded = await incrementUserCredit(interaction, 2);
          if (awarded) {
            await interaction.reply({ content: 'Bumped the post! You have been awarded 2 credits!', embeds: [forumLinks], ephemeral: true });
          } else {
            // Reply with a different message if credits were not awarded
            await interaction.reply({ content: 'Uh Oh!', embeds: [forumOops], ephemeral: true });
          }
        
          

        }
      
    };
  }
}