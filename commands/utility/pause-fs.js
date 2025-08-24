const { SlashCommandBuilder } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const playerState = require("./state/playerState-fs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("ставит на паузу!"),
  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.member.voice.channel) {
      return interaction.editReply(
        "**Ты не в можешь поставить на паузу, так как ты не в голосовом чате!**"
      );
    }

    if (!interaction.guild.members.me.voice.channelId) {
      return interaction.editReply("**Бот не в голосовом чате!**");
    }

    if (!playerState.player) {
      return interaction.editReply("**Нет активного воспроизведения!**");
    }

    const player = playerState.player;
    const playerStatus = playerState.player.state.status;

    switch (playerStatus) {
      case AudioPlayerStatus.Playing:
        interaction.editReply("**Пауза!**");
        return player.pause();
      case AudioPlayerStatus.Paused:
      case AudioPlayerStatus.AutoPaused:
        return interaction.editReply("**Трек уже на паузе!**");
      case AudioPlayerStatus.Idle:
        return interaction.editReply("**В данный момент очередь пуста!**");
      default:
        return interaction.editReply("**Неизвестное состояние плеера!**");
    }
  },
};
