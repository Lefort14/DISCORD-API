const { SlashCommandBuilder } = require('discord.js')
const { AudioPlayerStatus } = require('@discordjs/voice')
const playerState = require('./state/playerState-fs.js')
const { playTrack, trackEmitter } = require('./music-fs.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queque')
        .setDescription('Показывает очередь треков'),
        async execute(interaction) {
            try {
              
              await interaction.deferReply()
              
              if (!interaction.member.voice.channel) {
                return interaction.editReply("**Ты не можешь просмотреть, так как ты не в голосовом чате!**");
              }
              
              if(!interaction.member.voice.channel) {
                interaction.editReply("**зайди в голосовой чат!**");
              }
              
              if (playerState.queque.length === 0) {
                return interaction.editReply("**Нет очереди треков!**");
            }
            
            if (!interaction.guild.members.me.voice.channelId) {
              return interaction.editReply("**Бот не в голосовом чате!**");
            }
            
            queque(interaction)
          } catch (error) {
            console.log('Произошла ошибка:' + ` ${error}`);
            }
        }
}

function queque(interaction) {
  const trackQueue = playerState.queue

}
