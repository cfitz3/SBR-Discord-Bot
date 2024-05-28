const { SlashCommandBuilder } = require('discord.js');
const hypixel = require(`../../../hypixel.js`);
const utils = hypixel.Utils;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inactives')
        .setDescription('Cross-check the guild members and cache data'),
    async execute(interaction) {
        try {
            const guildData = await hypixel.getGuild('name', 'Skyblock and Relax');
            
            // Assuming guildData.members is the array of GuildMember objects
            const sortedMembers = guildData.members.sort((a, b) => {
                // Sort primarily by weeklyExperience (lowest to highest)
                if (a.weeklyExperience !== b.weeklyExperience) {
                    return a.weeklyExperience - b.weeklyExperience;
                }

                // If weeklyExperience is the same, sort by joinedAtTimestamp (oldest to newest)
                return a.joinedAtTimestamp - b.joinedAtTimestamp;
            });

            // Convert UUIDs to IGNs
            const igns = await Promise.all(sortedMembers.map(member => utils.toIGN(member.uuid)));
            
            console.log(igns);
        } catch (error) {
            console.error(error);
        }

        interaction.reply({ content: 'Logged', ephemeral: true });
    }
};