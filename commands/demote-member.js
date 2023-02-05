const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, getData, getNewRank, updateDataBase, canUpdateRank } = require("./functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('demote-member')
		.setDescription('Demotes ${USER}')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to demote, if not specified will demote you.")
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

		if (canUpdateRank(data.rank, false) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`${user.tag} is already at the lowest rank.`)
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const newRank = getNewRank(data.rank, false);

		if (updateDataBase(client, "members", { rank: newRank }, { where: { discord_id: user.id } }) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`Couldn't demote ${user.tag}`)
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Successfully demoted ${user.tag} to ${newRank}.`)

		await interaction.editReply({ embeds: [embed] })
	},
};