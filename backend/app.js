import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN_SECRET);
const cache = {};

const openai = new OpenAI({
  baseURL: 'https://api.neyra.ai/api/v1',
  apiKey: `${process.env.NEYRA_CHAT_KEY}`
});

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
    `${process.env.APP_FRONTEND_URL}tap`
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
          [playForAirdropButton],
          [followXButton],
          [shareButton]
        ]
      }
    }
  );
});

let cachedPointsData = null;
let lastFetchTime = null;

async function fetchPointsData() {
  if (!cachedPointsData || Date.now() - lastFetchTime > 600000) {
    // 10 minutes in milliseconds
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

bot.on('text', async (ctx) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'neyra/1D',
      stream: false,
      messages: [{ role: 'user', content: ctx.message.text }]
    });
    if (completion?.choices[0]?.message?.content) {
      ctx.reply(completion.choices[0].message.content);
    } else {
      throw Error('no response');
    }
  } catch (e) {
    console.log('error in chat:', e.message);
    ctx.reply('Sorry, chat is unavailable now. Please, try again later!');
  }
});

bot.launch();

app.listen(process.env.PORT, () =>
  console.log(`My server is running on port ${process.env.PORT}`)
);
