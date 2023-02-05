const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.addNumberOption(option =>
			option
				.setName("a")
				.setDescription("First number in the addition")
				.setRequired(true)
		)
		.addNumberOption(option =>
			option
				.setName("b")
				.setDescription("Second number in the addition")
				.setRequired(true)
		)
		.setDescription('Adds a and b and gives you their sum.'),

	async execute(client, interaction, options) {
		await interaction.deferReply();

		const a = interaction.options.getNumber('a');
		const b = interaction.options.getNumber('b');

		const exampleEmbed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.addFields(
				{ name: `add`, value: `${a} + ${b} = ${a + b}`, inline: true },
			)
			
		await interaction.editReply({embeds: [exampleEmbed]})
	},
};