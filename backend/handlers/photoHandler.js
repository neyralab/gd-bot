import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiAnalize = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: `${process.env.OPENROUTER_KEY}`
});

async function photoHandler(ctx) {
  try {
    const photoID = ctx.update.message.photo[0].file_id;
    const file = await ctx.telegram.getFile(photoID);
    const filePath = file.file_path;
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN_SECRET}/${filePath}`;
    const response = await openaiAnalize.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are an assistant in a Telegram bot. Answer briefly, as if chatting with someone. Give more details only if asked or if necessary. Describe detailed what`s in this image'
            },
            {
              type: 'image_url',
              image_url: {
                url
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });
    ctx.reply(response.choices[0].message.content);
  } catch (error) {
    console.error('Error getting file info:', error);
    ctx.reply(
      'An error occurred while processing the image. Please try again later!'
    );
  }
}

export default photoHandler;
