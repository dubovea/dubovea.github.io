const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.on("message", async (ctx) => {
  if (ctx.message) {
    console.log("Received data from platform:", 
      ctx.message);
  }
  if (!ctx.message.web_app_data) return;
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    await ctx.reply(
      `🎉 Вы набрали ${data.score} из ${data.total} правильных ответов!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Пройти ещё раз",
                web_app: { url: process.env.WEBAPP_URL },
              },
            ],
          ],
        },
      }
    );
  } catch (e) {
    console.error("Ошибка:", e);
    await ctx.reply("Произошла ошибка при обработке результатов.");
  }
});

bot.launch();
console.log("Бот запущен!");
