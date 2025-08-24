const { SlashCommandBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const fs = require("fs");
const playerState = require("./state/playerState-fs.js");
const musicPath = require('./state/path.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Играет музыку!")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Введите название песни!")
        .setRequired(true)
    )
    // .addStringOption((option) =>
    // option
    // .setName("folder")
    // .setDescription("Выберите песню из папки!")
    // .setRequired(false)
    // .addChoices(
    // )

    // )
    ,
  async execute(interaction) {
    
    // Ожидание ответа
    await interaction.deferReply();

    // Пользователь не в чате
    if(!interaction.member.voice.channel) {
      interaction.editReply(`зайди в голосовой чат!`);
    }
    
    // Подключение к голосовому чату
    if(!playerState.connection) {
      playerState.connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    // Аудиоплеер и ресурс
    const track = interaction.options.getString("choice");

    // Поиск песни в папке
    const files = fs.readdirSync(musicPath);
    const founder = files.filter((file) => {
      return file.toLowerCase().includes(track.toLowerCase());
    });

    if (founder.length === 0) {
      return interaction.editReply(`**Трек "${track}" не найден!**`);
    }

    const randomIndex = Math.floor(Math.random() * founder.length);
    const selectedTrack = founder[randomIndex];

    if(playerState.isPlaying) {
      playerState.queque.push(selectedTrack)
      return interaction.editReply(`**Добавлено в очередь: ${selectedTrack}. Позиция в очереди: ${playerState.queque.length}**`)
    }
    
    // Воспроизведение
    playerState.isPlaying = true;
    playerState.currentTrack = selectedTrack;
    playTrack(selectedTrack, interaction)
  },
  playTrack: playTrack,
};

function playTrack (track, interaction) {
  
  //Создание папки с аудиоресурсом
  const resource = createAudioResource(
    `${musicPath}/` + `${track}`
  );

  // Создание аудиоплеера и подключения, если его нет
  if(!playerState.player) {
  playerState.player = createAudioPlayer();
  playerState.connection.subscribe(playerState.player);
  }

  //Проигрывание трека
  playerState.player.play(resource);
  if(playerState.queque.length > 0) {
  interaction.editReply(`**Сейчас играет: ${track}. Позиция в очереди: ${playerState.queque.length}**`) 
  } else interaction.editReply(`**Сейчас играет: ${track}**`)
  
  // Обработка очереди после окончания трека
  playerState.player.on(AudioPlayerStatus.Idle, () => {
    if(playerState.queque.length > 0) {
      playerState.nextTrack = playerState.queque.shift()
      playTrack(playerState.nextTrack, interaction)
    } else {
      playerState.isPlaying = false
      playerState.currentTrack = null
    }
  })
}

