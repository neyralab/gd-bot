import { Markup } from 'telegraf';

import termsMessage from './termsMessage.js';
import fetchPointsData from './fetchPointsData.js';

async function termsHandler(ctx) {
  try {
    const pointsData = await fetchPointsData();
    const pointsActions = pointsData.data
      .map((action) => {
        return `- ${action.action_text}: ${action.amount} Points`;
      })
      .join('\n');

    const terms = termsMessage(process.env.BOT_NAME, pointsActions);

    const openAppButton = Markup.button.webApp(
      'Open GhostDrive',
      process.env.APP_FRONTEND_URL
    );
    const extra = Markup.inlineKeyboard([openAppButton]);

    ctx.replyWithHTML(terms, extra);
  } catch (error) {
    console.log('Error parsing terms handler', error);
    try {
      ctx.reply(`Error: ${error.message}`);
    } catch (e) {
      console.log('Error reply temrs', error);
    }
  }
}

export default termsHandler;
