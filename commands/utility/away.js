const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logout')
		.setDescription('logout'),
	async execute(interaction) {
		await interaction.reply('⏳самоуничтожение...')
		setTimeout(async () => {
		await interaction.followUp('пока-пока!')	
		await interaction.client.destroy()
		}, 600)
		console.log('bot left!')
	},
};




