import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Import node-fetch to make fetch work in Node.js

dotenv.config();
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN_SECRET);
const cache = {};

bot.start(async (ctx) => {
  const header = "<b>Let's get started!</b>";
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
      const response = await fetch(
          `${process.env.GD_BACKEND_URL}/apiv2/user/create/telegram`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'client-id': process.env.GD_CLIENT_ID,
              'client-secret': process.env.GD_CLIENT_SECRET
            },
            body: JSON.stringify(userData)
          }
      );

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      cachedUserData = await response.json();
      cache[cacheKey] = cachedUserData;
    } catch (error) {
      ctx.reply(`Error: ${error.message}`);
      return;
    }
  }

  const data = cachedUserData;
  const referralLink = `https://t.me/${process.env.BOT_NAME}?start=${data?.coupon?.code}`;
  const welcomeText = 'Join the Ghostdrive Community!';
  const activitiesText = 'Ghostdrive is the #1 Telegram Drive – easy to use, upload files, and get rewarded!\n\n' +
    '💰 $6 Million Airdrop: Earn points and upgrade your account to boost your rewards.\n' +
    '🎮 Tap Game: Have fun and earn more points with our exciting tap game.\n' +
    '🔗 Filecoin Integration: Enjoy seamless integration with the Filecoin network.\n' +
    '👥 Invite Friends: Earn points for every friend you invite.\n\n' +
    'Get started with Ghostdrive today and be part of the future of decentralized storage on Ton chain!';
  const buttonText = 'Open GhostDrive';
  const buttonUrl = process.env.APP_FRONTEND_URL;
  const button = Markup.button.webApp(buttonText, buttonUrl);
  const shareButtonText = 'Share Referral Link';
  const shareButton = Markup.button.switchToChat(
    shareButtonText,
    referralLink
  );

  ctx.replyWithPhoto(
    { source: fs.createReadStream('./assets/start.png') },
    {
      caption: `${header}\n\n${welcomeText}\n\n${activitiesText}\n\nSend this referral link to your friends ⤵️\n${referralLink}`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[button], [shareButton]]
      }
    }
  );
});

let cachedPointsData = null;
let lastFetchTime = null;

async function fetchPointsData() {
  if (!cachedPointsData || Date.now() - lastFetchTime > 600000) { // 10 minutes in milliseconds
    const response = await fetch(`${process.env.GD_BACKEND_URL}/api/gd/points`);
    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }
    cachedPointsData = await response.json();
    lastFetchTime = Date.now();
  }
  return cachedPointsData;
}

bot.command('terms', async (ctx) => {
  try {
    const pointsData = await fetchPointsData();
    const pointsActions = pointsData.data
      .map((action) => {
        return `- ${action.action_text}: ${action.amount} Points`;
      })
      .join('\n\n');

    const termsMessage = `<b>Community-Focused Airdrop: GD Token on TON Blockchain</b>

Welcome to GhostDrive Community Airdrop for the GD Token on the Ton Blockchain! Our goal is to reward active users with GD points for their actions and tasks, fostering a vibrant and engaged community.

How It Works:

1. Join the Telegram Program
   - Connect with our bot: [@${process.env.BOT_NAME}](#).
   - Engage with the community and stay updated with the latest announcements.

2. Launch GhostDrive Telegram Mini App
   - Click the "Open GhostDrive" button to launch the app directly within Telegram.
   - Seamlessly access and manage your GD points and rewards.

3. Start Point Mining
   - Begin earning GD Points through various activities and tasks.
   - Track your progress and points accumulation through the bot.

Earning GD Points:

${pointsActions}

Points Booster:

We also offer a Points Booster packages that includes additional storage space for one year. Enhance your earning potential and enjoy expanded storage capabilities:

- Points Booster with Storage Space:
  - Unlock increased storage capacity for 12 months.
  - Boost your GD Points earnings with exclusive benefits.

Ends by Aug 16`;

    const openAppButton = Markup.button.webApp(
      'Open GhostDrive',
      process.env.APP_FRONTEND_URL
    );
    const extra = Markup.inlineKeyboard([openAppButton]);

    ctx.reply(termsMessage, extra);
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
