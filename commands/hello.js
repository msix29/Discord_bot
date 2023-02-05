const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Says Hello ${YOUR_NAME}'),
	async execute(client, interaction, options) {
		await interaction.reply(`Hello, ${interaction.user.username}!`);
	},
};