module.exports = {
	
	// @description Executes when the button interaction could not be fetched.

	async execute(interaction) {
		await interaction.reply({
			content: "There was an issue while fetching this button!",
			ephemeral: true,
		});
		return;
	},
};
