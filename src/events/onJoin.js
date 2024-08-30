
const {createWelcomeEmbed} = require('../responses/embeds/adminEmbeds.js');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
      console.log('guildMemberAdd event fired');  

 try {
    const welcomeEmbed = createWelcomeEmbed(member)
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
