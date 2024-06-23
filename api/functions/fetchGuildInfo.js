
/**
 * Fetches guild information from Hypixel API.
 * @param {string} guildName - The name of the guild to fetch information for.
 * @returns {Promise<Object|null>} - A promise that resolves to the guild information object, or null if fetching fails.
 */

const hypixel = require('../../hypixel.js');


module.exports = async function fetchGuildInfo(guildName) {
    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 3000;

    while (retryCount < maxRetries) {
        try {
            const guild = await hypixel.getGuild('name', guildName);
            return guild;
        } catch (error) {
            console.error('Error fetching player information:', error);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }

    console.error('Failed to fetch guild information after multiple retries');
    return null;
};