const getWeight = require("../../../api/stats/weight.js");
const getSkills  = require("../../../api/stats/skills.js");
const fetchPlayerInfo = require("../../../api/functions/fetchPlayerInfo.js");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLatestProfile } = require('../../../api/functions/getLatestProfile.js');
const { formatNumber } = require("../../../contracts/helperFunctions.js");
const { getNetworth } = require("skyhelper-networth");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Verify that you are in the guild and sync your roles!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription(`Enter the player's IGN`)
                .setRequired(true)),

    execute: async (interaction) => {
        try {

            
            const playerName = interaction.options.getString('username');
            let player = await fetchPlayerInfo(playerName);
            const uuid = player.uuid;

            const data = await getLatestProfile(uuid, { museum: true });
            const profile = await getWeight(data.profile, data.uuid);

            const profileNetworth = await getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
                cache: true,
                onlyNetworth: true,
                museumData: data.museum,
            });
            const networth = formatNumber(profileNetworth.networth);

            const skills = getSkills(data.profile);
            const skillKeys = Object.keys(skills).filter(skill => !["runecrafting", "social"].includes(skill));
            const totalLevelWithProgress = skillKeys.reduce((total, skill) => total + skills[skill].levelWithProgress, 0);
            const skillAverage = (totalLevelWithProgress / skillKeys.length).toFixed(2);

            const meetsRequirements = profile.senither.total > 4000 && profile.lily.total > 4000;

            const checkEmbed = new EmbedBuilder()
                .setColor(`${meetsRequirements ? '#b2fba5' : '#ee6969'}`)
                .setTitle(`${playerName}'s Profile Stats!`)
                .addFields(
                    { name: 'Senither', value: `Total: **${formatNumber(profile.senither.total)}**\nSkills: ${formatNumber(Object.values(profile.senither.skills).reduce((acc, curr) => acc + curr.total, 0))}\nSlayer: ${formatNumber(profile.senither.slayer.total)}\nDungeons: ${formatNumber(profile.senither.dungeons.total)}`, inline: true },
                    { name: 'Lily', value: `Total: **${formatNumber(profile.lily.total)}**\nSkills: ${formatNumber(profile.lily.skills.total)}\nSlayer: ${formatNumber(profile.lily.slayer.total)}\nDungeons: ${formatNumber(profile.lily.catacombs.total)}`, inline: true },
                    { name: 'Networth', value: `${playerName}'s Networth: ${networth}` },
                    { name: 'Skill Average', value: `${playerName}'s Skill Average: ${skillAverage}` },
                    { name: meetsRequirements ? `:white_check_mark: ${playerName} meets the requirements for SBR+` : `:x: ${playerName} does not meet the requirements for SBR+`, value: meetsRequirements ? 'Congratulations :tada:' : 'Better luck next time!' }
                )
                .setTimestamp();

            if (interaction && interaction.reply) {
                interaction.reply({ embeds: [checkEmbed], ephemeral: false });
            }
        } catch (error) {
            console.error('Error logging player and profile data:', error);
            if (interaction && interaction.reply) {
                interaction.reply({ content: error.message, ephemeral: true });
            }
        }
    }
};
