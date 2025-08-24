const { Events } = require("discord.js");
const fs = require("fs");
const playerState = require("../commands/utility/state/playerState-fs.js");
const path = require('path')

const logsPath = path.join(__dirname, 'logs.txt') 

const date = () => {
    const date = new Date(Date.now())
    return date.toLocaleString()
}

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute(oldState, newState) { 
            if (oldState.member.id !== oldState.client.user.id) return;
            if (oldState.channelId && !newState.channelId) {
                console.log('Бот был принудительно отключён!')
                fs.writeFile(logsPath, `[${date()}] Бот был принудительно отключён!` + '\n', { flag: 'a' }, (err) => {
                    if (err) throw err; 
                })
                cleanPlayer()
            }
    }
}

function cleanPlayer() {
    playerState.connection.destroy()
    playerState.player.stop()
    playerState.player = null
    playerState.isPlaying = false
    playerState.currentTrack = null
    playerState.queque = []
    playerState.nextTrack = null
    playerState.connection = null
}