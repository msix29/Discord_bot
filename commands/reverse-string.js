const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reverse-string')
		.setDescription('Reverses the givin strings')
		.addStringOption(option =>
			option
				.setName("text")
				.setDescription("text to be reversed")
				.setRequired(true)
		),

	async execute(client, interaction, options) {
		await interaction.deferReply();

		const text = interaction.options.getString('text');

		const exampleEmbed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.addFields(
				{ name: `Text`, value: text },
				{ name: `Reversed`, value: text.split("").reverse().join("") },
			)
			
		await interaction.editReply({embeds: [exampleEmbed]})
	},
};