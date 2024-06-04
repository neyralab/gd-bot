import express from "express";
import { Telegraf, Markup } from "telegraf";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const header = "<b>Let's get started!</b>";
  const refCode = ctx.startPayload;
  const user = ctx.from;
  const userData = {
    id: user.id.toString(),
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name || "",
    photo_url: '',
    referral: refCode
  };

  try {
    const response = await fetch(`${process.env.GD_BACKEND_URL}/apiv2/user/create/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': process.env.GD_CLIENT_ID,
        'client-secret': process.env.GD_CLIENT_SECRET
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const data = await response.json();
    const coupon = data.data.coupon;

    const additionalText = `Here is your coupon code: ${coupon} ${ctx.startPayload}`;
    const buttonUrl = process.env.APP_FRONTEND_URL;
    const buttonText = "Open GhostDrive";
    const button = Markup.button.webApp(buttonText, buttonUrl);

    ctx.replyWithPhoto(
      { source: fs.createReadStream("./assets/start.png") },
      {
        caption: `${header}\n\n${additionalText}`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[button]],
        },
      }
    );
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

bot.on("text", (ctx) => {
  ctx.reply("Sorry, command is not recognized");
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
