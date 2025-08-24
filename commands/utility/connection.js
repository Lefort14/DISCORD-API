const { SlashCommandBuilder, GatewayIntentBits, Client  } = require('discord.js')

const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]
  });


module.exports = {
    data: new SlashCommandBuilder()
    .setName('connect')
    .setDescription('connect to voice channel'),
    async execute(interaction) {
		await interaction.reply('подключился!')	
		if(!interaction.member.voice.channel) {
			interaction.reply(`зайди в голосовой чат!`)
		}
		
		joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		
    }
}
