const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",

    execute(message, args) {
        const start = Date.now();

        // Your customizable message string
        const customMessage = "I'm online!";

        message.channel.send({ content: customMessage }).then(sentMessage => {
            const end = Date.now();
            const responseTime = end - start;
            const uptime = formatUptime(message.client.uptime);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Ping!')
                .addField('Custom Message', customMessage)
                .addField('Response Time', `${responseTime}ms`)
                .addField('Uptime', uptime);

            sentMessage.edit({ content: null, embeds: [embed] });
        });
    },
};

function formatUptime(milliseconds) {
    const totalSeconds = milliseconds / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor(((totalSeconds % 86400) % 3600) / 60);
    const seconds = Math.floor(((totalSeconds % 86400) % 3600) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
