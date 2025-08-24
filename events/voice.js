const { Events } = require('discord.js');
const fs = require('fs');

const date = () => {
    const date = new Date(Date.now())
    return date.toLocaleString()
}

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute(oldState, newState) {
        if(oldState.channelId !== newState.channelId) {
            
            if(!oldState.channel && newState.channel) {
                console.log(`[${date()}] ${newState.member.user.username} зашёл в ${newState.channel.name}`)
            
                fs.writeFile('E:/JS/Discord-API/events/logs.txt', `[${date()}] ${newState.member.user.username} зашёл в ${newState.channel.name}` + '\n', { flag: 'a' }, (err) => {
                    if (err) throw err; 
                })
            }
        
            if(oldState.channel && !newState.channel) {
                console.log(`[${date()}] ${newState.member.user.username} вышел из ${oldState.channel.name}`)
            
                fs.writeFile('E:/JS/Discord-API/events/logs.txt', `[${date()}] ${newState.member.user.username} вышел из ${oldState.channel.name}` + '\n', { flag: 'a' }, (err) => {
                    if (err) throw err; 
                })
            }

            if(oldState.channel && newState.channel) {
                console.log(`[${date()}] ${newState.member.user.username} перешёл из ${oldState.channel.name} в ${newState.channel.name}`)
            
                fs.writeFile('E:/JS/Discord-API/events/logs.txt', `[${date()}] ${newState.member.user.username} перешёл из ${oldState.channel.name} в ${newState.channel.name}` + '\n', { flag: 'a' }, (err) => {
                    if (err) throw err; 
                })
            }

            const channel = newState.guild.channels.cache.get('1383879797503164567');
            
            const mess = [
                `О-о-о баля,`, `Ашалеть,`,
                `Иу!`, `Салам, родной`
            ]
            
            
            try {
                if(newState.channel) {
                    let channel1 = newState.channel.name
                    
                    if(newState.channel.name === 'Лестница Ниситы') {
                        channel1 = 'пришёл на лестницу Ниситы'
                    }
                    if(newState.channel.name === 'Станция Отдых') {
                        channel1 = 'пришёл на станцию Отдых'
                    }
                    if(newState.channel.name === 'Дом в Шатуре') {
                        channel1 = 'зашёл в дом в Шатуре'
                    }
                    channel.send(`${mess[Math.floor(Math.random() * mess.length)]} ${newState.member.displayName} ${channel1}!`);              
                } 
            } catch(err) {
                console.log('неверный токен канала')
            }
        }
    }
}
