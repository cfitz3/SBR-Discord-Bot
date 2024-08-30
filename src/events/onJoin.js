
const { EmbedBuilder } = require('discord.js');

const welcomeEmbed = (member) => {
    return new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle(`:wave: Welcome to the server!`)
        .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
        .setDescription('Want to join our guilds? Do /join with <@1233695323092684842> in #bot-commands!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: 'Need Help? Find out more in #support! | by @withercloak' });
};

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
      console.log('guildMemberAdd event fired');  

 try {
              const welcomeChannelId = '1242864037792845875'; 
        const welcomeChannel = await member.guild.channels.cache.get(welcomeChannelId);
        if (!welcomeChannel) {
            console.error(`Channel with ID ${welcomeChannelId} not found`);
            return;
        }
            welcomeChannel.send({ content: `Welcome <@${member.id}>!`, embeds: [welcomeEmbed(member)] });
        } catch (error) {
            console.error(`Error in guildMemberAdd: ${error.message}`);
        }
    }
}
