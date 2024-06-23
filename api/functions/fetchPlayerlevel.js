
/**
 * Fetches the player level for a given player name and UUID.
 * @param {string} playerName - The name of the player.
 * @param {string} uuid - The UUID of the player.
 * @returns {number} - The player level.
 * @throws {Error} - If an error occurs while fetching player profiles or if no selected profile is found.
 */

const fetchPlayerInfo = require('./fetchplayerInfo');

async function getPlayerLevel(playerName, uuid) {
    try {
        const profiles = await fetchPlayerInfo(playerName);
        console.log(`Profiles for ${playerName}:`, profiles);

        if (!Array.isArray(profiles)) {
            console.error('Profiles is not an array:', profiles);
            throw new Error('An error occurred while fetching player profiles. Please try again later.');
        }
       
        const selectedProfile = profiles.find(profile => profile.selected === true);
        console.log(`Selected profile for ${playerName}:`, selectedProfile);

        const member = selectedProfile.members.find(member => member.uuid === uuid);
        const playerLevel = member.level;

        if (selectedProfile) {
            console.log(`Player Level for ${playerName}: ${playerLevel}`);
            return playerLevel;
        } else {
            console.log(`No selected profile found for ${playerName}`);
            throw new Error('No selected profile found. Please try again later.');
        }
        
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

module.exports = getPlayerLevel;