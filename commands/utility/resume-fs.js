const { SlashCommandBuilder } = require('discord.js')
const { AudioPlayerStatus } = require('@discordjs/voice')
const playerState = require('./state/playerState-fs.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('возобновляет проигрывание музыки!'),
    async execute(interaction) {
        
        await interaction.deferReply()

        if (!interaction.member.voice.channel) {
            return interaction.editReply(
              "**Ты не в можешь продолжить воспроизведение, так как ты не в голосовом чате!**"
            );
          }

        if(!interaction.member.voice.channel) {
            interaction.editReply(`зайди в голосовой чат!`);
          }

        if (!playerState.player) {
            return interaction.editReply("**Нет активного воспроизведения!**");
        }

        if (!interaction.guild.members.me.voice.channelId) {
            return interaction.editReply("**Бот не в голосовом чате!**");
          }
        
        const player = playerState.player
        const playerStatus = playerState.player.state.status

        switch (playerStatus) {
            case AudioPlayerStatus.Playing:
                return interaction.editReply('**Трек уже играет!**')    
            case AudioPlayerStatus.Paused:
            case AudioPlayerStatus.AutoPaused:
                player.unpause()
                return interaction.editReply('**Продолжаем!**')  
            case AudioPlayerStatus.Idle:
                return interaction.editReply('**В данный момент очередь пуста!**') 
            default:
                return interaction.editReply('**Неизвестное состояние плеера!**')
        }
    }
}