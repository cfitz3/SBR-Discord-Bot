const { prefix } = require('../../config.json');
const hypixel = require('../../hypixel.js');
const fs = require('fs').promises;
const path = require('path');

// Function to send message content in chunks
async function sendChunks(channel, content) {
    const chunkSize = 2000;
    const chunks = [];
    let currentChunk = '';

    for (const line of content.split('\n')) {
        if (currentChunk.length + line.length + 1 <= chunkSize) {
            currentChunk += line + '\n';
        } else {
            chunks.push(currentChunk);
            currentChunk = line + '\n';
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    for (const chunk of chunks) {
        for (let i = 0; i < chunk.length; i += chunkSize) {
            const chunkPart = chunk.substring(i, i + chunkSize);
            await channel.send(chunkPart);
        }
    }
}

module.exports = {
    name: "debugverify",
    description: "Get guild information for a player",
    async execute(message, args) {
        try {
            // Check if the command matches "verify"
            if (!message.content.startsWith(prefix + "debugverify")) return;

               // Check if the user is the developer
        if (message.author.id !== '729688465041522718') {
            return message.channel.send("Only the developer can use this command.");
        }

            // Debug log: Command received
            console.log("Command received: verify");

            if (!args.length) {
                // Debug log: No player name provided
                console.log("No player name provided");
                return message.channel.send("Please provide a player name.");
            }

            // Fetch the player's guild information
            const playerName = args[0];
            const playerData = await hypixel.getPlayer(playerName, { guild: true });

            // Check if the player has a guild
            if (!playerData.guild) {
                // Debug log: Player is not in a guild
                console.log(`Player ${playerName} is not in a guild.`);
                return message.channel.send(`Player ${playerName} is not in a guild.`);
            }

            // Debug log: Player is in a guild
            console.log(`Player ${playerName} is in a guild.`);
            await sendChunks(message.channel, `Player ${playerName} is in a guild.`);

            // Extract only the UUIDs from guild members' data
            const guildMemberUUIDs = playerData.guild.members.map(member => member.uuid);

            // Load existing UUIDs from the JSON database file
            const directoryPath = path.join(__dirname, '..', '..');
            const filePath = path.join(directoryPath, 'guildcache.json');
            let existingUUIDs = [];

            try {
                const fileData = await fs.readFile(filePath, 'utf-8');
                existingUUIDs = JSON.parse(fileData);
            } catch (error) {
                // Ignore if the file does not exist or cannot be read
            }

            // Debug log: Loaded existing UUIDs
            console.log("Loaded existing UUIDs:", existingUUIDs);
            await sendChunks(message.channel, `Existing UUIDs: ${existingUUIDs}`);

            // Filter out existing UUIDs from the guild members' UUIDs
            const newUUIDs = guildMemberUUIDs.filter(uuid => !existingUUIDs.includes(uuid));

            // Debug log: New UUIDs found
            console.log("New UUIDs found:", newUUIDs);

            // Add new UUIDs to the JSON database file
            if (newUUIDs.length > 0) {
                await fs.appendFile(filePath, JSON.stringify(newUUIDs, null, 2) + '\n');
                // Debug log: New UUIDs added to database
                console.log("New UUIDs added to database:", newUUIDs);
                await sendChunks(message.channel, `New UUIDs added?: ${newUUIDs}`);
            }

            // Load the message author's UUID from guildmembers.json
            const guildMembersFilePath = path.join(directoryPath, 'guildmembers.json');
            let guildMembersData = {};

            try {
                const fileData = await fs.readFile(guildMembersFilePath, 'utf-8');
                guildMembersData = JSON.parse(fileData);
            } catch (error) {
                // Ignore if the file does not exist or cannot be read
            }

            // Debug log: Loaded guild members data
            console.log("Loaded guild members data:", guildMembersData);
            await sendChunks(message.channel, `Guild member's data: ${guildMembersData}`);

            // Check if the message author's UUID is in the updated list
            const authorUUID = guildMembersData[message.author.id]?.uuid;
            const isAuthorInGuild = guildMemberUUIDs.includes(authorUUID);

            // Debug log: Checked if message author is in guild
            console.log(`Message author is ${isAuthorInGuild ? 'in' : 'not in'} the guild.`);
            await sendChunks(message.channel, `Is the Message Author in the Guild?: ${isAuthorInGuild}`);

            // Send a message indicating whether the message author is in the guild or not
            await sendChunks(message.channel, `Message author is ${isAuthorInGuild ? 'in' : 'not in'} the guild.`);
        } catch (error) {
            console.error('Error fetching player guild information:', error);
            await message.channel.send(`Error: Unable to fetch player guild information`);
        }
    },
};
