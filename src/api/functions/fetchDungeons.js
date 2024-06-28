
/**
 * Fetches Dungeon information with retries.
 * @param {string} playerName - The name of the player.
 * @returns {Promise<Object>} - A Promise that resolves to the dungeons information of the player.
 */

const hypixel = require('../constants/hypixel.js');

async function fetchDungeonInfo(playerName) {
    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 3000; 

    while (retryCount < maxRetries) {
        try {
            const member = await hypixel.getSkyblockMember(playerName);
            if (!member) {
                return;
            }
            const dungeonsInfo = member.dungeons;
            if (!dungeonsInfo) {
                console.log(`No dungeons data for ${playerName}`);
                return;
            }
            return dungeonsInfo;
        } catch (error) {
            console.error('Error fetching member information:', error);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }

    console.error('Failed to fetch member information after multiple retries');
};

module.exports = fetchDungeonInfo;
