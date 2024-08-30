const { EmbedBuilder } = require(`discord.js`);

const syncHelp = new EmbedBuilder()
    .setColor(0xFF69B4)
    .setTitle('Verify your Guild Membership and Sync your roles!')
    .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
    .setDescription('Having difficulty syncing your guild roles? Follow the steps below to sort that out :)')
    .addFields(
        { name: ':recycle: Verification/Sync:', value: 'Follow these steps to verify your membership and sync your roles:\n\n1. Ensure you have linked your account to our system with /link.\n2. Run /sync using <@1233695323092684842>\n3. You are now verified!', inline: true }
    )
    .setTimestamp()
    
    const linkHelp = new EmbedBuilder()
	.setColor(0xFF69B4)
	.setTitle('Linking your Discord Account to our Bot.')
	.setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
	.setDescription('Having difficulty linking your accounts? Follow the steps below to fix this.')
	.addFields(
        { name: ':one: Linking your Discord account to Hypixel:', value: 'Follow these steps to link your account:\n\n1. Click on `My Profile` (Right Click) in a Hypixel lobby\n2. Click on `Social Media`\n3. Left-click on `Discord`\n4. Paste your Discord username in chat', inline: true }
	)
    .addFields(
        { name : ':two: Linking your Discord account to our Bot:', value: 'This one is easier!:\n\n1. Run `/link` followed by your Minecraft username using <@1233695323092684842>\n2. The bot will then check you have completed the step above.\n3. If all is well, you are now linked!', inline: true }
    )
	.setTimestamp()

    const forumLinks = new EmbedBuilder()
    .setColor(0xFF69B4)
    .setTitle('Bump our Forum Posts!')
    .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
    .setDescription('Click the link below to bump our posts and help advertise the guild!\n**One credit will be awarded per post!** ')
    .addFields(
        { name: ':recycle: Bump Links:', value: 'Click the links below to bump our posts:\n\n1. [SBR Forum](https://hypixel.net/threads/skyblock-and-relax-sbr-friendly-skyblock-guild-w-no-requirements-800m-giveaways-custom-guild-bridge-bots.5616872/)\n2. [SBR+ Forum](https://hypixel.net/threads/skyblock-relax-plus-sbr-200-member-community-800m-giveaways-custom-guild-bridge-bots.5698295/)', inline: true }
        
    )

    const forumOops = new EmbedBuilder()
    .setColor(0xFF69B4)
    .setTitle('Oh No!')
    .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
    .setDescription(`Looks like you've already bumped the post today! You can bump again in 12 hours.`)
    .setTimestamp()

    
    const guildJoinEmbed = new EmbedBuilder()
    .setTitle('🏳️ Join The Guild!')
    .setDescription("Pick a guild to join from the menu below and you'll be automatically invited!\n\n**How it works:**\n- Pick a guild below.\n- Enter your Minecraft Username in the text box.\n- Click Submit!")
    .setFooter({ 
        text: "Issues with the bot? Open a ticket in #support or contact @withercloak!", 
        iconURL: "https://cdn.discordapp.com/avatars/729688465041522718/6631d3ec83e132a1be44336d59477efd.webp?size=4096"
    })
    .setAuthor({ 
        name: "SBR Discord Bot", 
        iconURL: "https://i.imgur.com/9wP2alI.png"
    })
    .setColor('#e7c6ff');

        
    function createInactivityForm(interaction, inactivitytime, inactivityreason) {
        return new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('Guild Inactivity Form')
            .setDescription(`<@${interaction.user.id}> has submitted an inactivity form.`)
            .addFields({ name: 'Inactivity Time', value: inactivitytime, inline: true })
            .addFields({ name: 'Reason', value: inactivityreason, inline: true })
            .setTimestamp();
    }

   function createWelcomeEmbed(member) {
        return new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle(`:wave: Welcome to the server!`)
        .setAuthor({ name: 'SBR Guild Bot', iconURL: 'https://i.imgur.com/eboO5Do.png' })
        .setDescription('Want to join our guilds? Do /join with <@1233695323092684842> in #bot-commands!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: 'Need Help? Find out more in #support! | by @withercloak' });
   }
   
   function createGuildJoinEmbed(username, interaction) {
    return new EmbedBuilder()
   .setDescription('\n')
   .addFields(
       { name: '⠀\n<:grassblock:1278862195106512936> **Minecraft IGN:**', value: `\`${username}\``, inline: true },
       { name: '⠀\n<:clyde:1278864427709497427> **Discord Username:**', value: `\`${interaction.user.username}\``, inline: true },
       { name: '🛡️ **Background Check:**', value: '`Passed!`', inline: false }
   )
   .setColor('#e7c6ff')
   .setThumbnail(interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 }))
   .setTimestamp()
   .setAuthor({ name: 'SBR Discord Bot', iconURL: 'https://i.imgur.com/9wP2alI.png'});
}
	
    module.exports = {
        syncHelp,
        linkHelp,
        forumLinks,
        forumOops,
        createInactivityForm,
        createWelcomeEmbed,
        createGuildJoinEmbed,
        guildJoinEmbed
    };