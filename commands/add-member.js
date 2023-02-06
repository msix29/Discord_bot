const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { authenticate, isUserExists } = require("../functions")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-member')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to add, if not specified will add you, if not already added.")
				.setRequired(true)
		)
		.setDescription('Adds a specific user.'),

	async execute(client, interaction, options) {
		await interaction.deferReply();

		if (authenticate(client) === false) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("There was a problem loading the database.")
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const user = options.getUser('user') || interaction.user;

		if (isUserExists(client, user) === true) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`${user.tag} is already added.`)
	
			return await interaction.editReply({ embeds: [embed] })
		}

		try {
			client.sequelize.models.members.create({
				discord_id: user.id
			});
		} catch (err) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("There was a problem adding the user!")
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Added ${user.tag} successfully.`)

		await interaction.editReply({ embeds: [embed] })
	},
};