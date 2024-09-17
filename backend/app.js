import './config.js';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import fetch from 'node-fetch';
import { telegrafThrottler } from 'telegraf-throttler';
import axios from 'axios';
import Queue from 'bull';
import { createClient } from 'redis';

import photoHandler from './handlers/photoHandler.js';
import textHandler from './handlers/textHandler.js';
import termsHandler from './commands/terms/index.js';
import logger from './utils/logger.js';

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN_SECRET, {
  handlerTimeout: Infinity
});

bot.catch((e) => {
  logger.error('bot.catch', e);
});

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

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
await redisClient.connect();

const userCreationQueue = new Queue('userCreation', process.env.REDIS_URL);

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
  let userRefCode = '';

  // Cache userData by user.id

  const cachedUserData = await redisClient.get(`user:${userData.id}`);

  if (cachedUserData) {
    const refcode = JSON.parse(cachedUserData)?.user?.referral?.code;
    userRefCode = refcode;
  }

  if (!cachedUserData) {
    try {
      const url = `${process.env.GD_BACKEND_URL}/apiv2/user/create/telegram`;

      logger.info('Creating user', {
        url,
        userData,
        chat_id: ctx.chat.id.toString()
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

      const job = await userCreationQueue.add({
        url,
        userData,
        headers: headers
      });
      const result = await job.finished();
      userRefCode = result?.user?.referral?.code;
    } catch (error) {
      logger.error('Error queueing user creation', {
        error,
        chat_id: ctx.chat.id.toString()
      });

      try {
        await ctx.reply(`Error: ${error.message}`);
      } catch (e) {
        logger.error('Error sending error message', {
          error: e,
          chat_id: ctx.chat.id.toString()
        });
      }
      return;
    }
  }

  const header =
    '<b>Welcome to Ghostdrive – The Ultimate Drive for the TON Ecosystem!</b>';
  const activitiesText =
    'Experience a new way to store and transform your raw data into smart data.\n\n' +
    '🚀 <b>Community Rewards:</b> Upload files to earn points, climb the leaderboard, and boost your rewards with our exciting tap game.\n\n' +
    '🎁 <b>Lifetime Storage Giveaway:</b> Enjoy storage from the Filecoin network. Invite friends and earn even more!\n\n' +
    '<b>Join Ghostdrive today and be part of our growing community!</b>';

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
  const referralLink = `https://t.me/${process.env.BOT_NAME}/ghostdrive?startapp=${userRefCode}`;
  const shareButton = {
    text: 'Share Link',
    url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`
  };
  try {
    await ctx.replyWithPhoto(
      { source: fs.createReadStream('./assets/start.png') },
      {
        caption: `${header}\n\n${activitiesText}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [dashboardButton],
            [followNewsButton],
            [shareButton]
          ]
        }
      }
    );
  } catch (error) {
    logger.error('Error replyWithPhoto:', {
      error,
      chat_id: ctx.chat.id.toString()
    });
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
    logger.error('Error in pre_checkout_query:', {
      error,
      chat_id: ctx.chat.id.toString()
    });
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
          error: replyError,
          chat_id: ctx.chat.id.toString()
        });
      }
    } else {
      try {
        await ctx.reply(
          'Payment received, but there was an issue confirming it. Please contact support.'
        );
      } catch (replyError) {
        logger.error('Error sending payment issue message', {
          error: replyError,
          chat_id: ctx.chat.id.toString()
        });
      }
    }
  } catch (error) {
    logger.error('Error in successful_payment:', {
      error,
      chat_id: ctx.chat.id.toString()
    });
    try {
      await ctx.reply(
        'There was an error processing your payment. Please contact support.'
      );
    } catch (replyError) {
      logger.error('Error sending payment error message', {
        error: replyError,
        chat_id: ctx.chat.id.toString()
      });
    }
  }
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);

userCreationQueue.process(async (job) => {
  const { url, userData, headers } = job.data;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData),
      timeout: 180000 // 3 minutes in milliseconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    await redisClient.set(userData.id, JSON.stringify(data));
    return data;
  } catch (error) {
    logger.error('Error creating user', { error, userData });
    if (error?.response?.description?.includes('Too Many Requests')) {
      await job.moveToDelayed(Date.now() + 60000);
      return;
    } else {
      throw error;
    }
  }
});

userCreationQueue.on('failed', (job, err) => {
  logger.error('Job failed', {
    jobId: job.id,
    userData: job.data.userData,
    error: err.message,
    stack: err.stack
  });
});

userCreationQueue.on('error', (error) => {
  logger.error('Queue error', {
    error: error.message,
    stack: error.stack
  });
});

userCreationQueue.on('delayed', async (job) => {
  try {
    await job.retry();
    logger.info('Delayed job retried', { jobId: job.id });
  } catch (error) {
    logger.error('Error retrying delayed job', {
      jobId: job.id,
      error: error.message,
      stack: error.stack
    });
  }
});
