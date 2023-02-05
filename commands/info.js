const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, getData } = require("./functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Gets the info of a specific user')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want the info of, if not specified will send your info.")
		),

	async execute(client, interaction, options) {
		await interaction.deferReply();

		if (authenticate(client) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("There was a problem loading the database.")

			return await interaction.editReply({ embeds: [embed] })
		}

		const user = options.getUser('user') || interaction.user;
		const data = await getData(client, user);

		if (data === null) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`No data found for ${user.tag}`)

			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.addFields(
				{ name: 'id', value: user.id },
				{ name: 'rank', value: data.rank },
				{ name: 'strikes', value: `${data.strikes}` },
			)
			.setFooter(
				{ text: user.tag }
			)

		await interaction.editReply({ embeds: [embed] })
	},
};