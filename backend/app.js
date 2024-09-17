import './config.js';
import express from 'express';
import { Markup, Telegraf } from 'telegraf';
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
import { generateRef } from './utils/generateRef.js';
import parseStartParams from './utils/startParamsParser.js';
import sendMobileAuthButton from './utils/sendMobileAuthButton.js';
import errorTransformer from './utils/errorTransformer.js';

const app = express();
export const bot = new Telegraf(process.env.BOT_TOKEN_SECRET, {
  handlerTimeout: Infinity
});

bot.catch((e) => {
  logger.error('bot.catch', errorTransformer(e));
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

bot.on('pre_checkout_query', async (ctx) => {
  try {
    const body = ctx.update;
    logger.info('Start pre_checkout_query', {
      // ctx: Object.keys(ctx),
      body: body
    });
    const response = await axios.post(
      `${process.env.TG_BILLING_ENDPOINT}`,
        body
    );

    logger.info('pre_checkout_query transferred to Neyra');

  } catch (error) {
    logger.error('Error in pre_checkout_query:', {
      error: errorTransformer(error),
      ctx: Object.keys(ctx)
    });
  }
});

bot.on('successful_payment', async (ctx) => {
  try {
    const body = { message: ctx.message };
    logger.info('Start successful_payment', {
      chat_id: ctx?.chat?.id.toString(),
      body: body
    });
    const paymentInfo = ctx.message.successful_payment;
    const response = await axios.post(`${process.env.TG_BILLING_ENDPOINT}`, body);

    if (response.status < 400) {
      try {
        await ctx.reply('Payment successfully confirmed. Thank you!');
      } catch (replyError) {
        logger.error('Error sending payment confirmation message', {
          error: errorTransformer(replyError),
          chat_id: ctx?.chat?.id.toString()
        });
      }
    } else {
      try {
        await ctx.reply(
          'Payment received, but there was an issue confirming it. Please contact support.'
        );
      } catch (replyError) {
        logger.error('Error sending payment issue message', {
          error: errorTransformer(replyError),
          chat_id: ctx?.chat?.id.toString()
        });
      }
    }
  } catch (error) {
    logger.error('Error in successful_payment:', {
      error: errorTransformer(error),
      chat_id: ctx?.chat?.id.toString()
    });
    try {
      await ctx.reply(
        'There was an error processing your payment. Please contact support.'
      );
    } catch (replyError) {
      logger.error('Error sending payment error message', {
        error: errorTransformer(replyError),
        chat_id: ctx?.chat?.id.toString()
      });
    }
  }
});


function buildUserData(user, chat_id, refCode) {
  return {
    id: user.id.toString(),
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name || '',
    photo_url: '',
    referral: refCode,
    is_premium: !!user.is_premium,
    chat_id,
  };
}

async function createUser(userData, showMobileAuthButton) {
  const url = `${process.env.GD_BACKEND_URL}/apiv2/user/create/telegram`;
  const headers = buildHeaders();
  const code = generateRef(userData.chat_id);
  userData.code = code;

  logger.info('Creating user', { url, userData, chat_id: userData.chat_id });

  await userCreationQueue.add({
    url,
    userData,
    headers,
    showMobileAuthButton,
  });

  return code;
}

function buildHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'client-id': process.env.GD_CLIENT_ID,
    'client-secret': process.env.GD_CLIENT_SECRET,
  };

  if (process.env.GD_BACKEND_HOST) {
    headers['Host'] = process.env.GD_BACKEND_HOST;
  }

  return headers;
}

async function handlePaylink(refCode, ctx) {
  const [_, slug] = refCode.split('_');
  const url = `${process.env.APP_FRONTEND_URL}/paid-view/${slug}`;
  try {
    await ctx.reply(
      'You are using a special link. To open the file, please click the button below.',
      Markup.inlineKeyboard([Markup.button.webApp('Open', url)])
    );
  } catch (error) {
    await handleError(error, ctx);
  }
}

async function handleStorageGift(refCode, ctx) {
  const [_, token] = refCode.split('_');
  const url = `${process.env.APP_FRONTEND_URL}/start?storageGift=${token}`;
  try {
    await ctx.reply(
      'You are using a special link. To claim your storage reward, please click the button below.',
      Markup.inlineKeyboard([Markup.button.webApp('Open', url)])
    );
  } catch (error) {
    await handleError(error, ctx);
  }
}

async function sendWelcomeMessage(ctx, userRefCode) {
  const header = '<b>YES! Tap for Your Bytes & Beyond with us! 🚀</b>';
  const activitiesText = `
Think you’ve got fast fingers? It’s time to show them off! With GhostDrive’s Tap Game, every tap brings you closer to incredible rewards.

<b>🔥 Earn as You Play:</b> Accumulate points and unlock storage, rewards, and more.
<b>🎯 Climb the Leaderboard:</b> Out-tap the competition and claim your spot at the top!
<b>🎁 Tap, Refer, Win:</b> Get bonus points & rewards when you invite friends!

This isn’t just a game, it’s your chance to win BIG & boost your digital storage.
<b>Get ready for the future with GhostDrive! 📲💡</b>

Don’t forget to follow us on socials for exclusive updates, events, and more!
`;

  const buttons = buildButtons(userRefCode);
  try {
    await ctx.replyWithAnimation(
      { source: fs.createReadStream('./assets/start.mp4'), filename: 'start.mp4' },
      {
        caption: `${header}\n\n${activitiesText}`,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: buttons },
      }
    );
  } catch (error) {
    logger.error('Error replyWithAnimation:', { error: errorTransformer(error), chat_id: ctx.chat.id.toString() });
  }
}

function buildButtons(userRefCode) {
  const dashboardButton = Markup.button.webApp('🎮 Play & Earn', `${process.env.APP_FRONTEND_URL}/start`);
  const followNewsButton = Markup.button.url('🎙 GhostDrive News', 'https://t.me/ghostdrive_web3');
  const chatButton = Markup.button.url('💬 Chat', 'https://t.me/ghostdrive_web3_chat');
  const followXButton = Markup.button.url('🐦 X', 'https://x.com/GhostDrive_Web3');
  const youtubeButton = Markup.button.url('🔴 Youtube', 'https://www.youtube.com/@ghostdrive-web3');
  const websiteButton = Markup.button.url('🛸 Website', 'https://ghostdrive.com');

  const referralLink = `https://t.me/${process.env.BOT_NAME}/ghostdrive?startapp=${userRefCode}`;
  const shareButton = {
    text: '👥 Invite Friends',
    url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`,
  };

  return [
    [dashboardButton],
    [followNewsButton],
    [chatButton, followXButton],
    [youtubeButton, websiteButton],
    [shareButton],
  ];
}

async function handleError(error, ctx) {
  logger.error('Error:', { error: errorTransformer(error), chat_id: ctx.chat.id.toString() });
  try {
    await ctx.reply(`Error: ${error.message}`);
  } catch (e) {
    logger.error('Error sending error message:', { error: errorTransformer(e), chat_id: ctx.chat.id.toString() });
  }
}

bot.command('terms', termsHandler);

bot.on('text', textHandler);

bot.on('photo', photoHandler);

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);

userCreationQueue.process(async (job) => {
  const ttl = 60 * 60 * 24 * 30; // time-to-live for data when saving it to a Redis client
  const { url, userData, headers, showMobileAuthButton } = job.data;
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
    await redisClient.set(
      `user:${userData.id}`,
      JSON.stringify(data),
      'EX',
      ttl
    );
    if (showMobileAuthButton) {
      sendMobileAuthButton(userData.chat_id, data.jwt);
    }
    return data;
  } catch (error) {
    logger.error('Error creating user', {
      error: errorTransformer(error),
      userData
    });
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
