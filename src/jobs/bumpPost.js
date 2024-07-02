const config = require('../../config.json');
const cron = require('node-cron');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

async function bumpPost(client) {
    const bumpEmbed = new EmbedBuilder()
        .setColor(2067276)
        .setAuthor({ name: "Bump our Forum Posts!" })
        .setDescription(`Click the link below to bump our posts and help advertise the guild!\n**Two credits will be awarded per post** `)
        .setFooter({
            text: `by @withercloak | Open a ticket in #support!`,
            iconURL: "https://i.imgur.com/eboO5Do.png",
        });

    const bumpRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Our Forum Posts')
                .setCustomId('sbr_bump')
                .setStyle(ButtonStyle.Success),
        );

    const sbrBridgeChannel = await client.channels.cache.get(config.server.sbr_bridge_channel);
    const sbrPlusBridgeChannel = await client.channels.cache.get(config.server.sbr_plus_bridge_channel);    

    if (sbrBridgeChannel && sbrPlusBridgeChannel) {
        await sbrBridgeChannel.send({ embeds: [bumpEmbed], components: [bumpRow] })
            .then(() => console.log('Post sent to SBR Forum channel at', new Date().toISOString()));
        await sbrPlusBridgeChannel.send({ embeds: [bumpEmbed], components: [bumpRow] })
            .then(() => console.log('Post sent to SBR+ Forum channel at', new Date().toISOString()));
    }
}

// Directly schedule the bumpPost function to run every day at 10:00 AM
 cron.schedule('0 */12 * * *', () => {
    bumpPost(client).catch(console.error);
}, {
    scheduled: true,
    timezone: "GMT+0"
});

module.exports = { bumpPost };