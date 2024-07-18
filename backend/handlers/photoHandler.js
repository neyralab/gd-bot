import callLLMProvider from '../utils/callLLMProvider.js';
import logger from '../utils/logger.js';

async function photoHandler(ctx) {
  try {
    const chatId = ctx.message.chat.id;
    const userId = ctx.from.id;
    const thinkingMsg = await ctx.reply('⚡️ Analyzing image...');
    const photoID = ctx.update.message.photo?.at(0)?.file_id;
    const file = await ctx.telegram.getFile(photoID);
    const filePath = file.file_path;
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN_SECRET}/${filePath}`;
    logger.info(`Incoming analyze request`, {
      userId,
      chatId,
      url: url
    });
    const response = await callLLMProvider(url, 'image');
    logger.info(`Outgoing analyze response`, {
      userId,
      chatId,
      response: response.trim()
    });
    await ctx.telegram.editMessageText(
      thinkingMsg.chat.id,
      thinkingMsg.message_id,
      null,
      response.trim(),
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error getting file info:', error);
    logger.error(`Error analyze`, {
      userId,
      chatId,
      error
    });
    ctx.reply(
      'An error occurred while processing the image. Please try again later!'
    );
  }
}

export default photoHandler;
