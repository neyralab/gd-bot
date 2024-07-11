import callLLMProvider from '../utils/callLLMProvider.js';

async function photoHandler(ctx) {
  try {
    const thinkingMsg = await ctx.reply('⚡️ Analyzing image...');
    const photoID = ctx.update.message.photo?.at(0)?.file_id;
    const file = await ctx.telegram.getFile(photoID);
    const filePath = file.file_path;
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN_SECRET}/${filePath}`;
    const response = await callLLMProvider(url, 'image');
    await ctx.telegram.editMessageText(
      thinkingMsg.chat.id,
      thinkingMsg.message_id,
      null,
      response.trim(),
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error getting file info:', error);
    ctx.reply(
      'An error occurred while processing the image. Please try again later!'
    );
  }
}

export default photoHandler;
