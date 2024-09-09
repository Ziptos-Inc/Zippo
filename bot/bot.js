import { Telegraf } from 'telegraf'

const TOKEN = import.meta.env.VITE_BOT_TOKEN;

const web_link = "https://ziptos-mini-app.vercel.app/"

const bot = new Telegraf(TOKEN)
bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to Ziptos*`, {
        reply_markup: { inline_keyboard: [[{ text: "Start now!", web_app: {url: urlSent}}]], in: true },
    });
})   

bot.launch()