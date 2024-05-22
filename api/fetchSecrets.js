/**
 * Retrieves the highest skyblockTreasureHunter achievement for a player.
 * @param {Array} profiles - An array of player profiles.
 * @param {Object} hypixel - The Hypixel API object.
 * @returns {number|string} - The highest skyblockTreasureHunter achievement value or a string indicating no secrets found.
 */

async function getPlayerSecrets(profiles, hypixel) { 
    
    const playerProfiles = await Promise.all(profiles.map(profile => Promise.all(profile.members.map(member => hypixel.getPlayer(member.uuid).catch(() => null) )) ));
    const allMembers = profiles.flatMap((profile, i) =>
        profile.members.map((member, j) => ({
            skyblockTreasureHunter: playerProfiles[i][j] ? playerProfiles[i][j].achievements.skyblockTreasureHunter : null // Fetch the skyblockTreasureHunter achievement
        }))
    );

    allMembers.sort((a, b) => b.skyblockTreasureHunter - a.skyblockTreasureHunter);

    const highestSkyblockTreasureHunter = allMembers[0].skyblockTreasureHunter;

    if (highestSkyblockTreasureHunter === undefined || highestSkyblockTreasureHunter === null) {
        return "This player hasn't found any secrets!";
    }

    return highestSkyblockTreasureHunter;
};

module.exports = getPlayerSecrets;

