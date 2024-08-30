const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const fs = require("fs");
const join_sbr= require("../interactions/modals/category/joinSBR.js");
const join_sbr_plus = require("../interactions/modals/category/joinPlus.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId !== 'guild_join_menu') {
            const selectedOption = interaction.values[0];
            const filePath = `./src/responses/${selectedOption}.json`;
            let response;
            try {
                response = JSON.parse(fs.readFileSync(filePath, "utf8")).response;
            } catch (error) {
                console.error(error);
                response = 'Invalid selection.';
            }
            await interaction.reply({
                content: response,
                ephemeral: true,
            });

            // Guild join logic
        } else if (interaction.isStringSelectMenu() && interaction.customId === 'guild_join_menu') {
            const selectedOption = interaction.values[0];
            if (selectedOption === 'sbr') {
                await join_sbr.execute(interaction);
            }
            else if (selectedOption === 'sbr_plus') {
                await join_sbr_plus.execute(interaction);
            }}}}


   
    
       
