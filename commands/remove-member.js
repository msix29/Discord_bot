const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, isUserExists } = require("../functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-member')
		.setDescription('Removes ${USER} from the \"members\" table.')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to remove, if not specified will remove you.")
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

		if (isUserExists(client, user) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`${user.tag} is already added.`)
	
			return await interaction.editReply({ embeds: [embed] })
		}

		try {
			await client.sequelize.models.members.destroy({ where: { discord_id: user.id } })
		} catch (err) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("Couldn't remove from the user, maybe the user isn't in the database.")
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Removed ${user.tag} successfully.`)

		await interaction.editReply({ embeds: [embed] })
	},
};