const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда для старта
bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать в викторину! Нажмите кнопку ниже, чтобы начать.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Начать викторину",
              web_app: { url: process.env.WEBAPP_URL },
            },
          ],
        ],
      },
    }
  );
});

// Обработка данных из WebApp
bot.on("message", async (ctx) => {
  if (ctx.message.web_app_data) {
    const data = JSON.parse(ctx.message.web_app_data.data);
    
    // Отправляем результат в чат
    await ctx.reply(
      `🎉 Викторина завершена!\nВаш результат: ${data.score} из ${data.total}`
    );
    
    // Закрываем WebApp
    try {
      await ctx.answerWebApp({
        type: "close_web_app",
      });
    } catch (e) {
      console.log("Ошибка при закрытии WebApp:", e.message);
    }
  }
});

bot.launch();
console.log("Бот запущен и готов к работе!");

// Обработка ошибок
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));