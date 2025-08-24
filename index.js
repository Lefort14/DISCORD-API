const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands'); // получаем путь к папке с командами 
const commandFolders = fs.readdirSync(foldersPath); // читаем папку с командами

for (const folder of commandFolders) { // перебираем папки в папке с командами
	const commandsPath = path.join(foldersPath, folder); // создаём путь к наследуемой папке
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // читаем папку и находим файлы с форматов .js
	for (const file of commandFiles) { // перебираем файлы в папке
		const filePath = path.join(commandsPath, file); // создаём путь к файлу из папки
		const command = require(filePath); // экспортируем файл из папки
		if ('data' in command && 'execute' in command) { // проверяем условие на наличие свойств data и функции execute
			client.commands.set(command.data.name, command); // регистрируем команду при наличии обоих условий
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events'); // читаем папку с ивентами
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // фильтруем файлы по формату .js

for (const file of eventFiles) { // работаем с файлами папки с ивентами
	const filePath = path.join(eventsPath, file); // объединяем путь папки с файлом
	const event = require(filePath); // экспортируем файл
	if (event.once) { // если ивент единоразовый
		client.once(event.name, (...args) => event.execute(...args)); // регистрируем единоразовое событие 
	} else { // если вызов может быть многократным
		client.on(event.name, (...args) => event.execute(...args)); // регистрируем многоразовое событие 
	}
}

//////////////////////////////////////

client.on('ready', () => {
	const guilds = client.guilds.cache // получаем ID гильдий
	guilds.forEach(guild => console.log(`${guild.name}: ${guild.id}`)) // перебираем айди гильдий и выводим в консоль в формате "ключ: значение"
})

client.login(token) // запускаем бота по токену


