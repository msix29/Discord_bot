const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unstrike-member')
		.setDescription('Unstrikes ${USER}')
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to unstrike, if not specified will unstrike you.")
		),

	async execute(client, interaction, options) {
		await interaction.deferReply();

		try {
			client.sequelize.authenticate()
		} catch (err) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("There was a problem loading the database.")
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const user = options.getUser('user') || interaction.user;
		let isZero = false
		let data;

		try {
			data = await client.sequelize.models.members.findOne({ where: { discord_id: user.id } })
		} catch (err) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle("Couldn't search the database.")
	
			return await interaction.editReply({ embeds: [embed] })
		}

		try {

			if (data.strikes > 0) {
				await client.sequelize.models.members.update({ strikes: data.strikes - 1 }, { where: { discord_id: user.id } });
			} else {
				isZero = true;
			};

		} catch (err) {
			const embed = new EmbedBuilder()
				.setColor([0, 0, 0])
				.setTitle(`Couldn't unstrike ${user.tag}`)
	
			return await interaction.editReply({ embeds: [embed] })
		}

		const embed = new EmbedBuilder()
			.setColor([0, 0, 0])
			.setTitle(`Unstriked ${user.tag} successfully.`)

		if (isZero) {
			embed.setDescription(`${user.tag} had 0 strikes, strikes can't be negative so won't decrease.`)
		}		

		await interaction.editReply({ embeds: [embed] })
	},
};