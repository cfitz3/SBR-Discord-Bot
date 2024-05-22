/**
 * Refreshes guild data and writes member UUIDs to a JSON file.
 * @param {Object} interaction - The interaction object.
 * @returns {Promise<void>} - A promise that resolves when the guild data is refreshed and member UUIDs are written to the file.
 */

const hypixel = require('../hypixel.js');
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'database', 'guildcache.json');


async function refreshGuildData(interaction) {
    const guildData = await hypixel.getGuild('name', 'Skyblock and Relax');
    
    if (!guildData || !guildData.members) {
        throw new Error('Guild data is undefined or does not contain members');
    }

    const uuids = guildData.members.map(member => ({ uuid: member.uuid }));
    
    await fs.writeFile(filePath, JSON.stringify(uuids, null, 2), 'utf-8');
    await interaction.reply({ content: 'Guild data refreshed and member UUIDs written to guildcache.json', ephemeral: true });
}

module.exports = refreshGuildData;