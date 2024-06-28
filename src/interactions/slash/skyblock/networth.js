const { getNetworth } = require("skyhelper-networth");
const { getLatestProfile } = require("../../../api/functions/getLatestProfile.js")
const { formatNumber, formatUsername } = require("../../../contracts/helperFunctions.js");
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('networth')
        .setDescription('networth test')
         .addStringOption(option =>
            option.setName('username')
                .setDescription(`Enter the player's IGN`)
                .setRequired(true)),

  async execute(interaction) {
    try {
      username = interaction.options.getString('username');

      const data = await getLatestProfile(username, { museum: true });

      username = formatUsername(username, data.profileData?.game_mode);

      const profile = await getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
        cache: true,
        onlyNetworth: true,
        museumData: data.museum,
      });

      if (profile.noInventory === true) {
        throw new SBRError("Player has inventory API off, try again later.");
      }
console.log(profile)
      const networth = formatNumber(profile.networth);
      const unsoulboundNetworth = formatNumber(profile.unsoulboundNetworth);
      const purse = formatNumber(profile.purse);
      const bank = profile.bank ? formatNumber(profile.bank) : "N/A";
      const museum = data.museum ? formatNumber(profile.types.museum?.total ?? 0) : "N/A";

      await interaction.reply(
        `${username}'s Networth is ${networth} | Unsoulbound Networth: ${unsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} | Museum: ${museum}`,
      );
    } catch (error) {
      console.log(error);
    }
  }
}

