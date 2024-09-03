import { Markup } from 'telegraf';
import { bot } from '../app.js';
import logger from './logger.js';

export default function (chatId, token) {
  const button = Markup.button.url(
    'Authorize',
    `https://app.ghostdrive.com/telegram/${token}`
  );
  const keyboard = Markup.inlineKeyboard([button]);

  try {
    bot.telegram.sendMessage(chatId, 'Authorize in Mobile app', keyboard);
  } catch (error) {
    logger.error('Error sending mobile authorize button:', {
      error,
      chat_id: chatId
    });
  }
}
