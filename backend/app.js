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
    'Experience a new way to store and transform your raw data into smart data. Join the Ghostdrive bot for AI image recognition and seamless Telegram sharing.\n\n' +
    '🚀 <b>Community Rewards:</b> Upload files to earn points, climb the leaderboard, and boost your rewards with our exciting tap game.\n\n' +
    '🎁 <b>Lifetime Storage Giveaway:</b> Enjoy storage from the Filecoin network. Invite friends and earn even more!\n\n' +
    '<b>Join Ghostdrive today and be part of our growing community!</b>';
  const buttonText = 'Open GhostDrive';
  const buttonUrl = process.env.APP_FRONTEND_URL;
  const button = Markup.button.webApp(buttonText, buttonUrl);
  const shareButtonText = 'Share Link';
  const shareButton = Markup.button.switchToChat(shareButtonText, referralLink);

  const dashboardButton = Markup.button.webApp(
    'Dashboard',
    `${process.env.APP_FRONTEND_URL}/start`
  );
  const followXButton = Markup.button.url(
    'Follow X',
    `https://twitter.com/ghostdrive_web3`
  );
  const followCommunityButton = Markup.button.url(
    'Follow Community',
    `https://t.me/ghostdrive_web3_chat`
  );
  const followNewsButton = Markup.button.url(
    'Follow News',
    `https://t.me/ghostdrive_web3`
  );
  try {
    await ctx.replyWithPhoto(
      { source: fs.createReadStream('./assets/start.png') },
      {
        caption: `${header}\n\n${activitiesText}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [dashboardButton],
            [followXButton],
            [followCommunityButton],
            [followNewsButton],
            [shareButton]
          ]
        }
      }
    );
  } catch (error) {
    await ctx.reply(`Error: ${error.message}`);
    console.error('Error replyWithPhoto:', error.message);
  }
});

bot.command('terms', termsHandler);

bot.on('text', textHandler);

bot.on('photo', photoHandler);

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
