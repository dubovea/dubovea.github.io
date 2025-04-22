const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 9000, // Увеличиваем таймаут
  telegram: { 
    webhookReply: false // Отключаем webhook для мобильных ответов
  }
});

// Обработчик для WebApp
bot.on("message", async (ctx) => {
  if (!ctx.message.web_app_data) return;
  
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    
    // Отправляем ответ через API (не через webhook)
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      `🎯 Ваш результат: ${data.score}/${data.total}`,
      { parse_mode: "HTML" }
    );
    
  } catch (e) {
    console.error("Mobile WebApp error:", e);
    await ctx.reply("⚠️ Ошибка обработки. Попробуйте позже.");
  }
});

// Запуск с разными параметрами для мобильных устройств
bot.launch({
  polling: process.env.NODE_ENV !== "production",
  webhook: process.env.NODE_ENV === "production" ? {
    domain: process.env.WEBHOOK_DOMAIN,
    port: process.env.PORT || 3000
  } : undefined
}).then(() => {
  console.log(`Бот запущен в ${process.env.NODE_ENV || "development"} режиме`);
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));