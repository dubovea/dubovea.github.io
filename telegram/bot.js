const { Telegraf } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN');

// Команда для старта
bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в викторину! Нажмите кнопку ниже, чтобы начать.', {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Начать викторину',
                    web_app: { url: 'https://username.github.io' }
                }]
            ]
        }
    });
});

// Обработка данных из WebApp
bot.on('message', (ctx) => {
    if (ctx.message.web_app_data) {
        const data = JSON.parse(ctx.message.web_app_data.data);
        ctx.reply(`Вы завершили викторину с результатом: ${data.score} из ${data.total}!`);
    }
});

bot.launch();