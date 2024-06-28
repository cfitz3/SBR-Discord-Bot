const { getLatestProfile } = require("../../../api/functions/getLatestProfile.js");
const hypixelRebornAPI = require("../../../api/constants/hypixel.js");
const { SBRError } = require("../../../messages/sbrError.js");
const config = require("../../../../config.json");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const guildCache= path.join(__dirname, '..', '..', '..', 'database/guildmembers.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Request to join the guild'),

  execute: async (interaction) => {
    const linked = JSON.parse(fs.readFileSync(guildCache, "utf8"));
    if (linked === undefined) {
        throw new SBRError("No verification data found. Please contact an administrator.");
    }

    const uuid = linked[interaction.user.id].uuid;
    if (uuid === undefined) {
      throw new SBRError("You are not linked, please do so using /link.");
    }

    const [player, { profile }] = await Promise.all([
      hypixelRebornAPI.getPlayer(uuid, { guild: true }),
      getLatestProfile(uuid),
    ]);

    console.log(profile)
    const skyblockLevel = (profile?.leveling?.experience || 0) / 100 ?? 0;

    const meetRequirements =
      skyblockLevel > config.server.requirements
    if (meetRequirements === false) {
      throw new SBRError(
        `You do not meet the requirements to join the guild. Please try again once you meet the requirements.`,
      );
    }

    const applicationEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setAuthor({ name: "Guild Application." })
      .setDescription(`Guild Application has been successfully sent to the guild staff.`)
      .setFooter({
        text: `by @withercloak | Open a ticket in #support!`,
        iconURL: "https://i.imgur.com/eboO5Do.png",
      });

    await interaction.reply({ embeds: [applicationEmbed] });

    const description = player.socialMedia
      .map((socialMedia) => `**${socialMedia.name}**: \`${socialMedia.link}\`\n`)
      .join("");

    // this is a mess, cba to make it better
    const fields = [];
    fields.push({ name: "Rank", value: `\`${player.rank ?? "None"}\``, inline: true });
    const playersGuild =
      player.guild?.name !== undefined
        ? `[${player.guild.name}](https://plancke.io/hypixel/guild/name/${encodeURIComponent(player.guild.name)})`
        : "None";
    fields.push({
      name: "Guild",
      value: playersGuild,
      inline: true,
    });
    fields.push({ name: "Level", value: `\`${player.level}\``, inline: true });
    fields.push({ name: "First Login", value: `<t:${Math.floor(player.firstLogin / 1000)}:R>`, inline: true });
    fields.push({ name: "Last Seen", value: `<t:${Math.floor(player.lastLogin / 1000)}:R>`, inline: true });
    fields.push({ name: "Karma", value: `\`${player.karma.toLocaleString()}\``, inline: true });
    fields.push({ name: "Skyblock LvL", value: `\`${skyblockLevel}\``, inline: true });
    fields.push({
      name: "SkyCrypt",
      value: `[Click](https://sky.shiiyu.moe/stats/${player.nickname})`,
      inline: true,
    });

    const statsEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setTitle(`${player.nickname}`)
      .setURL(`https://plancke.io/hypixel/player/stats/${player.uuid}`)
      .setThumbnail(`https://visage.surgeplay.com/full/512/${player.uuid}.png`)
      .setFields(fields)
      .setDescription(`${description}`)
      .setFooter({
        text: `by @withercloak | /help [command] for more information`,
        iconURL: "https://i.imgur.com/eboO5Do.png",
      });

      interaction.client.channels.fetch(config.server.joinrequests)
      .then(channel => channel.send({ embeds: [statsEmbed] }))
      .catch(console.error);
  },
};