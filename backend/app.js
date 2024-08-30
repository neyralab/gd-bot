import './config.js';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import fetch from 'node-fetch';
import { telegrafThrottler } from 'telegraf-throttler';
import axios from 'axios';

import photoHandler from './handlers/photoHandler.js';
import textHandler from './handlers/textHandler.js';
import termsHandler from './commands/terms/index.js';
import logger from './utils/logger.js';

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN_SECRET);
const throttler = telegrafThrottler({
  in: {
    period: 60000, // 60 seconds
    rate: 10, // 10 messages per minute
    burst: 10 // Allowing up to 10 messages in a burst
  },
  out: {
    period: 60000,
    rate: 30,
    burst: 10
  }
});
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
    referral: refCode,
    is_premium: !!user?.is_premium,
    chat_id: ctx.chat.id.toString()
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

      const headers = {
        'Content-Type': 'application/json',
        'client-id': process.env.GD_CLIENT_ID,
        'client-secret': process.env.GD_CLIENT_SECRET
      };

      // Check if GD_BACKEND_URL is a protocol + IP address
      if (process.env.GD_BACKEND_HOST) {
        headers['Host'] = process.env.GD_BACKEND_HOST;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        console.error('Failed to create user');
        throw new Error('Failed to create user');
      }

      cachedUserData = await response.json();
      //cache[cacheKey] = cachedUserData;
    } catch (error) {
      try {
        await ctx.reply(`Error: ${error.message}`);
      } catch (e) {
        logger.error('Error sending error message', { error: e });
      }
      return;
    }
  }

  const data = cachedUserData;
  const referralLink = `https://t.me/${process.env.BOT_NAME}/ghostdrive?startapp=${data?.coupon?.code}`;
  const header =
    '<b>Welcome to Ghostdrive – The Ultimate Drive for the TON Ecosystem!</b>';
  const activitiesText =
    'Experience a new way to store and transform your raw data into smart data.\n\n' +
    '🚀 <b>Community Rewards:</b> Upload files to earn points, climb the leaderboard, and boost your rewards with our exciting tap game.\n\n' +
    '🎁 <b>Lifetime Storage Giveaway:</b> Enjoy storage from the Filecoin network. Invite friends and earn even more!\n\n' +
    '<b>Join Ghostdrive today and be part of our growing community!</b>';
  const buttonText = 'Open GhostDrive';
  const buttonUrl = process.env.APP_FRONTEND_URL;
  const button = Markup.button.webApp(buttonText, buttonUrl);
  const shareButtonText = 'Share Link';
  const shareButton = {
    text: shareButtonText,
    url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`
  };

  const dashboardButton = Markup.button.webApp(
    'Open App',
    `${process.env.APP_FRONTEND_URL}/start`
  );
  const playButton = Markup.button.webApp(
    'Tap to Earn',
    `${process.env.APP_FRONTEND_URL}/game-3d`
  );
  const followXButton = Markup.button.url(
    'Follow X',
    `https://twitter.com/ghostdrive_web3`
  );
  const supportButton = Markup.button.url(
    'Support',
    `https://t.me/ghostdrive_web3_chat`
  );
  const followNewsButton = Markup.button.url(
    'Join The Community',
    `https://t.me/ghostdrive_web3`
  );
  try {
    await ctx.replyWithPhoto(
      { source: fs.createReadStream('./assets/start.png') },
      {
        caption: `${header}\n\n${activitiesText}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[dashboardButton], [followNewsButton]]
        }
      }
    );
  } catch (error) {
    logger.error('Error replyWithPhoto:', { error });
    try {
      await ctx.reply(`Error: ${error.message}`);
    } catch (e) {
      logger.error('Error sending error message after replyWithPhoto error', {
        error: e
      });
    }
  }
});

bot.command('terms', termsHandler);

bot.on('text', textHandler);

bot.on('photo', photoHandler);

bot.on('pre_checkout_query', async (ctx) => {
  try {
    const response = await axios.post(
      `${process.env.TG_BILLING_ENDPOINT}`,
      ctx.update
    );
  } catch (error) {
    logger.error('Error in pre_checkout_query:', { error });
  }
});

bot.on('successful_payment', async (ctx) => {
  try {
    const paymentInfo = ctx.message.successful_payment;
    const response = await axios.post(`${process.env.TG_BILLING_ENDPOINT}`, {
      message: ctx.message
    });

    if (response.status < 400) {
      try {
        await ctx.reply('Payment successfully confirmed. Thank you!');
      } catch (replyError) {
        logger.error('Error sending payment confirmation message', {
          error: replyError
        });
      }
    } else {
      try {
        await ctx.reply(
          'Payment received, but there was an issue confirming it. Please contact support.'
        );
      } catch (replyError) {
        logger.error('Error sending payment issue message', {
          error: replyError
        });
      }
    }
  } catch (error) {
    logger.error('Error in successful_payment:', { error });
    try {
      await ctx.reply(
        'There was an error processing your payment. Please contact support.'
      );
    } catch (replyError) {
      logger.error('Error sending payment error message', {
        error: replyError
      });
    }
  }
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
