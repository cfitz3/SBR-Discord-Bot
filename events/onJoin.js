
const { EmbedBuilder } = require('discord.js');

const welcomeEmbed = (member) => {
    return new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle(`:wave: Welcome to the server!`)
        .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
        .setDescription('Head over to <#1231564533336641548> to link your account and gain access to the server!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: 'Need Help? Find out more in #support! | by @withercloak' });
};

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const welcomeChannel = await member.guild.channels.cache.find(channel => channel.name === 'welcome');
        await welcomeChannel.fetch();
        welcomeChannel.send({ content: `Welcome <@${member.id}>!`, embeds: [welcomeEmbed(member)] });
    }
}