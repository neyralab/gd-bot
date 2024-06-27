import './config.js';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import fetch from 'node-fetch';
import { telegrafThrottler } from 'telegraf-throttler';

import photoHandler from './handlers/photoHandler.js';
import textHandler from './handlers/textHandler.js';
import termsHandler from './commands/terms/index.js';

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN_SECRET);
const throttler = telegrafThrottler();
bot.use(throttler);

const cache = {};

bot.start(async (ctx) => {
  const refCode = ctx.startPayload;
  const user = ctx.from;
  const userData = {
    id: user.id.toString(),
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name || '',
    photo_url: '',
    referral: refCode
  };

  // Cache userData by user.id
  const cacheKey = userData.id;
  let cachedUserData = cache[cacheKey];
  cachedUserData = null;

  if (!cachedUserData) {
    try {
      const url = `${process.env.GD_BACKEND_URL}/apiv2/user/create/telegram`;

      console.log({
        url,
        userData
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': process.env.GD_CLIENT_ID,
          'client-secret': process.env.GD_CLIENT_SECRET
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        console.error('Failed to create user');
        throw new Error('Failed to create user');
      }

      cachedUserData = await response.json();
      //cache[cacheKey] = cachedUserData;
    } catch (error) {
      ctx.reply(`Error: ${error.message}`);
      return;
    }
  }

  const data = cachedUserData;
  const referralLink = `https://t.me/${process.env.BOT_NAME}?start=${data?.coupon?.code}`;
  const header =
    '<b>Welcome to Ghostdrive – The Ultimate Drive for the TON Ecosystem!</b>';
  const activitiesText =
    'Experience the easiest way to upload files, share content with friends, and earn rewards!\n\n' +
    '<b>$6 Million Airdrop:</b> Upload files to earn points, reach the highest levels, and boost your rewards with our fun tap game.\n\n' +
    '<b>50 GB Giveaways:</b> Access over 400 million TB of storage from the Filecoin network. Invite friends and earn even more!\n\n' +
    '<b>Join Ghostdrive today and get started!</b>';
  const buttonText = 'Open GhostDrive';
  const buttonUrl = process.env.APP_FRONTEND_URL;
  const button = Markup.button.webApp(buttonText, buttonUrl);
  const shareButtonText = 'Share Link';
  const shareButton = Markup.button.switchToChat(shareButtonText, referralLink);
  const uploadForAirdropButton = Markup.button.webApp(
    'Upload for Airdrop',
    `${process.env.APP_FRONTEND_URL}file-upload`
  );
  const playForAirdropButton = Markup.button.webApp(
    'Play for Airdrop',
    `${process.env.APP_FRONTEND_URL}game`
  );
  const followXButton = Markup.button.url(
    'Follow X',
    `https://twitter.com/ghostdrive_web3`
  );

  ctx.replyWithPhoto(
    { source: fs.createReadStream('./assets/start.png') },
    {
      caption: `${header}\n\n${activitiesText}`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [uploadForAirdropButton],
          [followXButton],
          [shareButton]
        ]
      }
    }
  );
});

bot.command('terms', termsHandler);

bot.on('text', textHandler);

bot.on('photo', photoHandler);

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
