const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('foot')
        .setDescription('You did this to yourself.'),

    async execute(interaction) {
        await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1179906098191417405/1237419447791386665/5F8A84FD-09DD-41E1-9B39-26A092733610.jpg?ex=663b942a&is=663a42aa&hm=8a65956621f9a06533e9789735055d577e8e78be0ad48e591c72a8dffc3448c2&', ephemeral: false });
    }
};
