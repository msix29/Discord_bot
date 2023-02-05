const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, getData, getNewRank, updateDataBase, canUpdateRank } = require("./functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('strike-member')
		.setDescription('Strikes ${USER}')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to strike, if not specified will strike you.")
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

		if (updateDataBase(client, "members", { strikes: data.strikes + 1 }, { where: { discord_id: user.id } }) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`Couldn't demote ${user.tag}`)

			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Striked ${user.tag} successfully.`)

		await interaction.editReply({ embeds: [embed] })
	},
};