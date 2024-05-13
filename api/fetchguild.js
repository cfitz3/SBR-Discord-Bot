// Description: Fetch guild information from Hypixel API with retries.
const hypixel = require('../hypixel.js');

// Fetch player information with retries
module.exports = async function fetchGuildInfo(guildName) {
    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 3000; // 3 seconds

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