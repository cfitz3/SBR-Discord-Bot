const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const  guildJoinEmbed  = require('../../../responses/embeds/adminEmbeds.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the Guild!'),
        
    async execute(interaction) {
        try {

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('guild_join_menu')
                .setPlaceholder('Select an option')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Join SBR')
                        .setValue('sbr'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Join SBR+')
                        .setValue('sbr_plus')
                );

                const guildJoinEmbed = new EmbedBuilder()
                .setTitle('🏳️ Join The Guild!')
                .setDescription("Pick a guild to join from the menu below and you'll be automatically invited!\n\n**How it works:**\n- Pick a guild below.\n- Enter your Minecraft Username in the text box.\n- Click Submit!")
                .setFooter({ 
                    text: "Issues with the bot? Open a ticket in #support or contact @withercloak!", 
                    iconURL: "https://cdn.discordapp.com/avatars/729688465041522718/6631d3ec83e132a1be44336d59477efd.webp?size=4096"
                })
                .setAuthor({ 
                    name: "SBR Discord Bot", 
                    iconURL: "https://i.imgur.com/9wP2alI.png"
                })
                .setColor('#e7c6ff');

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.reply({ embeds: [guildJoinEmbed], components: [row] });

        } catch (error) {
            console.error('Error in join command:', error);
            await interaction.reply('There was an error processing your request.');
        }
    }
};