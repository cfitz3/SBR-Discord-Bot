const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot\'s latency, uptime, and other information'),

    async execute(interaction) {
        // Measure API latency using heartbeat interval
        const apiLatency = interaction.client.ws.ping;

        // Measure bot latency
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        // Get system information
        const cpu = os.cpus()[0].model;
        const platform = os.platform();
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Bot Information')
            .addFields(
                { name: 'Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: false },
                { name: 'Platform', value: `${platform}`, inline: true },
                { name: 'CPU', value: `${cpu}`, inline: true },
                { name: 'Memory Usage', value: `${memoryUsage.toFixed(2)} MB`, inline: true },
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Edit the initial reply with the embed
        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
