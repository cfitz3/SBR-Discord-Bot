const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { lookupPlayer } = require('../../../api/functions/scammerLookup.js');
const { publishMessage } = require('../../../api/constants/redisManager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the Guild!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your Minecraft username.')
                .setRequired(true)),
        
    async execute(interaction) {
        try {
            const username = interaction.options.getString('username');
            const playerLookup = await lookupPlayer(username);
      
            if (playerLookup.entries && playerLookup.entries.length > 0) {
                await interaction.reply('Your account has been flagged as suspicious. You cannot join the guild.');
                await interaction.member.roles.add('1278868448335626260');
                return;
            }

            const embed = new EmbedBuilder()
                .setDescription('\n')
                .addFields(
                    { name: '⠀\n<:grassblock:1278862195106512936> **Minecraft IGN:**', value: `\`${username}\``, inline: true },
                    { name: '⠀\n<:clyde:1278864427709497427> **Discord Username:**', value: `\`${interaction.user.username}\``, inline: true },
                    { name: '🛡️ **Background Check:**', value: '`Passed!`', inline: false }
                )
                .setColor('#e7c6ff')
                .setThumbnail(interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 }))
                .setTimestamp()
                .setAuthor({ name: 'SBR Discord Bot', iconURL: 'https://i.imgur.com/9wP2alI.png'});

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('join_main')
                        .setLabel('Join SBR')
                        .setStyle(ButtonStyle.Secondary), 
                    new ButtonBuilder()
                        .setCustomId('join_plus')
                        .setLabel('Join SBR+')
                        .setStyle(ButtonStyle.Secondary) 
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'join_main') {
                    // Publish to the 'invite-channel' Redis channel
                    await publishMessage('invite-channel', 'invite', username);
                    await i.update({ content: 'You have been invited! Make sure to do /sync when you join!', components: [] });
                } else if (i.customId === 'join_plus') {
                    // Publish to the 'other-channel' Redis channel
                    await publishMessage('plus_invite_channel', 'invite', username);
                    await i.update({ content: 'You have been invited! Make sure to do /sync when you join!', components: [] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'You failed to make a decision!', components: [] });
                }
            });
        } catch (error) {
            console.error('Error in jointest:', error);
            await interaction.reply('There was an error processing your request.');
        }
    }
};
