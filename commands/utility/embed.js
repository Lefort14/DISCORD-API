const { EmbedBuilder, SlashCommandBuilder, channelLink } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embed')
	.setDescription('send embed'),
    async execute(interaction) {
        const embedOne = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('AMADEUS CAME!')
        .setImage('https://i.imgur.com/cHDXRNi.jpeg')
    await interaction.reply({ embeds: [embedOne] })
    }

}