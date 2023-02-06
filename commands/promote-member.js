const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, getData, getNewRank, updateDataBase, canUpdateRank } = require("../functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('promote-member')
		.setDescription('Promotes ${USER}')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to promote, if not specified will promote you.")
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

		if (canUpdateRank(data.rank, true) === false) {
			return await interaction.editReply(`${user.tag} is already at the highest rank.`)
		}

		const newRank = getNewRank(data.rank, true);

		if (updateDataBase(client, "members", { rank: newRank }, { where: { discord_id: user.id } }) === false) {
			return await interaction.editReply(`Couldn't demote ${user.tag}`)
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Successfully promoted ${user.tag} to ${newRank}.`)

		await interaction.editReply({ embeds: [embed] })
	},
};