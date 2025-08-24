const { SlashCommandBuilder } = require('discord.js')

const debt = new SlashCommandBuilder()
.setName('debt')
.setDescription('показывает долг Игоря!')
.addStringOption(option => 
    option
    .setName('debts')
    .setDescription('debts category')
    .setRequired(true)
    .addChoices(
        { name: 'Max debt', value: 'Mdebt' },
        { name: 'Den debt', value: 'Ddebt' }
))

module.exports = {
    data: debt,
    async execute(interaction) {
        const response = await fetch('https://docs.google.com/spreadsheets/d/1Lk1PVl6_WMEaj3OHGeVgnqFTZixkhTF3zarQ3qp2m_0/gviz/tq?tqx=out:json');
        const rawText = await response.text();
        const choice = interaction.options.getString('debts')
            
        // Правильный способ обработки ответа Google Sheets
        const jsonString = rawText.match(/google\.visualization\.Query\.setResponse\((.+)\)/)[1];
        const data = JSON.parse(jsonString);
        
        // Извлекаем данные таблицы
        const rows = data.table.rows.map(row => {
            return row.c.map(cell => cell ? cell.v : null);
        });
        
        console.log(`Данные таблицы: ${rows[0].join(' ')}`);

        let message = 'Долг';
        rows.forEach(row => {
            if(choice === 'Mdebt') {
            message += ` Максу: ${row[0]} ₽`
            }
            if (choice === 'Ddebt') {
            message += ` Денису: ${row[1]} ₽`
            }
        });

        
        await interaction.reply(message);
    }
}