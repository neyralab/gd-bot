import express from "express";
import { Telegraf, Markup } from "telegraf";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const header = "<b>Let's get srarted!</b>";
  const additionalText =
    "Please tap the below to start Upload files to/from GhostDrive. " + ctx.startPayload;
  const buttonUrl = "https://tg.dev.ghostdrive.com/";
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
});

bot.on("text", (ctx) => {
  ctx.reply("Sorry, command is not recognized");
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
