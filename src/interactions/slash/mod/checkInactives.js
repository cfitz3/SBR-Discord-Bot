const { SlashCommandBuilder } = require('@discordjs/builders');
const hypixelRebornAPI = require("../../../api/constants/hypixel.js");
const { getUsername } = require("../../../api/constants/mowojangAPI.js");
const { Embed } = require("../../../utils/embedHandler.js");
const config = require("../../../../config.json");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inactiveplayers')
        .setDescription('Executes the purge command'),
    async execute(interaction) {
        try {

            await interaction.deferReply();
            
            const inactivity = JSON.parse(fs.readFileSync("./src/database/inactivemembers.json", "utf8"));
            if (inactivity === undefined) {
                return;
            }

            const { members } = await hypixelRebornAPI.getGuild("name", "Skyblock and Relax");
            if (members === undefined) {
                return;
            }

            const output = {};
            for (const member of members) {
                const joinedInLast7Days = new Date(member.joinedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
                const inactivityExpired = inactivity[member.uuid]?.expiration > Math.floor(Date.now() / 1000);
                const username = await getUsername(member.uuid);

                if (joinedInLast7Days || inactivityExpired || member.weeklyExperience > 50000) {
                    continue;
                }

                output[username] = member.weeklyExperience;
            }

            const sorted = Object.entries(output).sort(([, a], [, b]) => a - b);

            const list = sorted
                .map(([username, weeklyExperience]) => `\`${username}\` » ${weeklyExperience.toLocaleString()}\n`)
                .join("");

            const channel = await interaction.client.channels.fetch(config.server.staff_announcements);
            if (list.length > 2048) {
                fs.writeFileSync("data/weeklyPurge.txt", list.replaceAll("`", ""));

                await channel.send({
                    content: "The weekly purge is too large to send as a message, so here's a file instead.",
                    files: ["data/weeklyPurge.txt"],
                });
            } else {
                const embed = new Embed(3447003, "Inactive Guild Members", list);

                await channel.send({ embeds: [embed] });
            }
            await interaction.editReply("The weekly purge has been sent.");
        } catch (error) {
            console.log(error);
        }
    },
};