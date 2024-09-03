const { Events, EmbedBuilder } = require('discord.js');
const { lookupPlayer } = require('../api/functions/scammerLookup.js');
const { publishMessage } = require('../api/constants/redisManager.js');
const fs = require('fs');
const path = require('path');
const { createGuildJoinEmbed } = require('../responses/embeds/adminEmbeds.js'); 

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Deconstructed client from interaction object.
        const { client } = interaction;

        // Checks if the interaction is a modal interaction (to prevent weird bugs)
        if (!interaction.isModalSubmit()) return;

        const command = client.modalCommands.get(interaction.customId);

        // If the interaction is not a command in cache, return error message.
        // You can modify the error message at ./messages/defaultModalError.js file!
        if (!command) {
            console.log(`No command found for customId: ${interaction.customId}`);
            return await require('../messages/defaultModalError').execute(interaction);
        }

        // A try to execute the interaction.
        try {
            if (interaction.customId === 'inactivityform') {
                const inactivitytime = interaction.fields.getTextInputValue('inactivitytime');
                const inactivityreason = interaction.fields.getTextInputValue('inactivityreason');

                console.log(`Received inactivity form with time: ${inactivitytime} and reason: ${inactivityreason}`);

                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('Guild Inactivity Form')
                    .setDescription(`<@${interaction.user.id}> has submitted an inactivity form.`)
                    .addFields({ name: 'Inactivity Time', value: inactivitytime, inline: true })
                    .addFields({ name: 'Reason', value: inactivityreason, inline: true })
                    .setTimestamp();

                const logChannel = client.channels.cache.get('1244978236178305074');

                await logChannel.send({ embeds: [embed] });

                // Write the inactivity form data to a JSON file
                const discord_id = interaction.user.id; // replace with the actual UUID
                const discord = interaction.user; // replace with the actual Discord user object
                const expiration = Date.now() / 1000 + inactivitytime * 60 * 60; // replace with the actual expiration time

                const data = {
                    discord: discord.tag,
                    discord_id: discord_id,
                    requested: Math.floor(new Date().getTime() / 1000),
                    requested_formatted: new Date().toLocaleString(),
                    expiration: expiration,
                    expiration_formatted: new Date(expiration * 1000).toLocaleString(),
                    reason: inactivityreason,
                };
                console.log(data);
                const inactivepath = path.join(__dirname, '..', 'database/inactivemembers.json');
                fs.writeFileSync(inactivepath, JSON.stringify(data, null, 2));

                // Reply to the interaction to acknowledge it
                await interaction.reply({ content: 'Your inactivity form has been submitted!', ephemeral: true });

            } else if (interaction.customId === 'join_sbr' || interaction.customId === 'join_sbr_plus') {
                const username = interaction.fields.getTextInputValue('username_input');
                const playerLookup = await lookupPlayer(username);

                if (playerLookup.entries && playerLookup.entries.length > 0) {
                    await interaction.reply('Your account has been flagged as suspicious. You cannot join the guild.');
                    await interaction.member.roles.add('1278868448335626260');
                    return;
                }

                const channel = interaction.customId === 'join_sbr' ? 'invite-channel' : 'plus_invite_channel';
                await publishMessage(channel, 'invite', username);

                const embed = createGuildJoinEmbed(username, interaction);
                await interaction.reply({ content: 'You have been invited! Make sure to do /sync when you join!', embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({ content: 'There was an issue processing your request. Please try again.', ephemeral: true });
        }
    }
};
