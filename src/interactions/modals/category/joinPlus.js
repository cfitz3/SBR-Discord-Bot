const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: "join_sbr_plus",
    description: "Apply to join the guild!",
  
    execute: async (interaction) => {
  const modal = new ModalBuilder().setCustomId("join_sbr_plus").setTitle("Guild Join");
  
  const usernameInput = new TextInputBuilder()
  .setCustomId('username_input')
  .setLabel('Username')
  .setStyle(TextInputStyle.Short)
  .setRequired(true);
  
  const actionRow = new ActionRowBuilder().addComponents(usernameInput);
  modal.addComponents(actionRow);
  
  await interaction.showModal(modal);
    }
  }