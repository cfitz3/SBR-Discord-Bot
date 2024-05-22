/**
 * Fetches player information from the Hypixel API with retries.
 * @param {string} playerName - The name of the player to fetch information for.
 * @returns {Promise<Object|null>} - A promise that resolves to the player information object, or null if fetching fails after multiple retries.
 */

const hypixel = require('../hypixel.js');

async function fetchPlayerInfo(playerName) {
    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 3000;

    while (retryCount < maxRetries) {
        try {
            const player = await hypixel.getPlayer(playerName);
            return player;
        } catch (error) {
            console.error('Error fetching player information:', error);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }

    console.error('Failed to fetch player information after multiple retries');
    return null;
};

module.exports = fetchPlayerInfo;