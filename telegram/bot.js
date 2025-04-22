const { Telegraf, Markup } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Команда старта с обычной клавиатурой
bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать в викторину! Нажмите кнопку ниже, чтобы начать.",
    Markup.keyboard([
      Markup.button.webApp("Начать викторину", process.env.WEBAPP_URL),
    ])
      .oneTime() // Клавиатура скроется после использования
      .resize() // Оптимальный размер кнопок
  );
});

bot.on("message", async (ctx) => {
  if (!ctx.message.web_app_data) return;
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    ctx.reply(
      `🎉 Вы набрали ${data.score} из ${data.total} правильных ответов!`,
      Markup.keyboard([
        Markup.button.webApp("Начать викторину", process.env.WEBAPP_URL),
      ])
        .oneTime() // Клавиатура скроется после использования
        .resize() // Оптимальный размер кнопок
    );
  } catch (e) {
    console.error("Ошибка:", e);
    await ctx.reply("Произошла ошибка при обработке результатов.");
  }
});

bot.launch();
console.log("Бот запущен!");
