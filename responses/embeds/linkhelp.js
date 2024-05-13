
// Build the example embed
const linkHelp = () => {
    return new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle('Your linked Discord account on Hypixel does not match your Discord ID!')
        .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
        .setDescription(':x: Oh no! It seems your Discord account is not linked on Hypixel. Follow the steps below to fix this.')
        .addFields({ name: ':recycle: Linking your Discord Account:', value: 'Follow these steps to link your account:\n\n1. Click on `My Profile` (Right Click) in a Hypixel lobby\n2. Click on `Social Media`\n3. Left-click on `Discord`\n4. Paste your Discord username in chat', inline: true })
        .setTimestamp()
        .setFooter({ text: 'Need help? Open a ticket in #support or contact @withercloak' });
};

module.exports = linkHelp;