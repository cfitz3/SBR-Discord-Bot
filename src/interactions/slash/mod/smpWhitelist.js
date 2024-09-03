const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../../config.json');
const { getUUID } = require('../../../api/constants/mowojangAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Apply to join the SMP!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your Minecraft username.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Why would you like to join?')
                .setRequired(true)),
        
    async execute(interaction) {
        try {
            // Get the username and reason from the interaction options
            const username = interaction.options.getString('username');
            const reason = interaction.options.getString('reason');
            const uuid = await getUUID(username);

            const embed = new EmbedBuilder()
                .setTitle('Whitelist Application')
                .setDescription(`Username: \`${username}\`\n\nReason: \`${reason}\``);

            const button1 = new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success);

            const button2 = new ButtonBuilder()
                .setCustomId('deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(button1, button2);

        // Disable the buttons after the collector ends

            const disabledbutton1 = new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Accept')
                .setDisabled(true)
                .setStyle(ButtonStyle.Success);

            const disabledbutton2 = new ButtonBuilder()
                .setCustomId('deny')
                .setLabel('Deny')
                .setDisabled(true)
                .setStyle(ButtonStyle.Danger);

            const disabledrow = new ActionRowBuilder()
                .addComponents(disabledbutton1, disabledbutton2);

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = (interaction) => interaction.member.roles.cache.has(config.server.admin);
            const collector = interaction.channel.createMessageComponentCollector({ filter });
            
            try {
                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'accept') {
                        console.log(interaction.customId);
                        await interaction.member.roles.add(config.server.whitelist_role);
                        // Write username and uuid to testdatabase.json
                        const data = [{
                            uuid: uuid,
                            name: username
                        }];
			const filePath = path.join(__dirname, '../../../../../../Modded-Server/whitelist.json');

			
			const updateWhitelist = (filePath, newEntry) => {
    			const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    			existingData.push(newEntry);
    			fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
			};

			updateWhitelist(filePath, { uuid: uuid, name: username });

			await interaction.reply('Your application has been accepted!');
                        collector.stop(); // Stop the collector when an interaction is made
                    } else if (interaction.customId === 'deny') {
                        await interaction.reply('Your application has been denied.');
                        collector.stop(); // Stop the collector when an interaction is made
                    }
                });
            } catch (error) {
                console.log(error);
            }

            collector.on('end', () => {
                // Collector ended
                interaction.editReply({ embeds: [embed], components: [disabledrow] });
            });

        } catch (error) {  
            console.log(error);
        }
    }
};
