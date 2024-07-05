import OpenAI from 'openai';
import callLLMProvider from '../utils/callLLMProvider.js';
import generateImage from '../utils/generateImage.js';

const openai = new OpenAI({
  baseURL: 'https://api.neyra.ai/api/v1',
  apiKey: `${process.env.NEYRA_CHAT_KEY}`
});

const state = new Map();

async function textHandler(ctx) {
  const chatId = ctx.message.chat.id;
  const messageText = ctx.message.text;

  // Retrieve the chat history from state
  const data = state.get(chatId) || {};
  const chatHist = data?.chatHist ? data.chatHist.slice(-5) : [];
  const chatHistStr = chatHist.join('\n\n');

  // Send thinking message
  const thinkingMsg = await ctx.reply('⚡️ Thinking...');

  // Call the LLM provider
  const response = await callLLMProvider(
    `${chatHistStr}\nUser: ${messageText}\nGhostDrive:`
  );

  // Update chat history
  chatHist.push(`User: ${messageText}\nGhostdrive: ${response}\n`);
  state.set(chatId, { chatHist });

  // Handle response and split for image prompt if present
  const [textResponse, imgPart] = response.includes('<IMG>')
    ? response.split('<IMG>')
    : [response, ''];
  const imgPrompt = imgPart ? imgPart.match(/{.*}/)[0] : '';
  const imgPromptValue = imgPrompt ? JSON.parse(imgPrompt).prompt : '';

  // Edit thinking message with LLM response
  try {
    await ctx.telegram.editMessageText(
      thinkingMsg.chat.id,
      thinkingMsg.message_id,
      null,
      textResponse.trim(),
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    if (err.description === 'Bad Request: message is empty') {
      await ctx.telegram.editMessageText(
        thinkingMsg.chat.id,
        thinkingMsg.message_id,
        null,
        'Got it!'
      );
    } else {
      await ctx.telegram.editMessageText(
        thinkingMsg.chat.id,
        thinkingMsg.message_id,
        null,
        textResponse.trim()
      );
    }
  }

  // Handle image generation if imgPrompt is present
  if (imgPrompt) {
    const genPlaceholder = await ctx.reply('📸 Generating image...');

    if (imgPromptValue) {
      try {
        const image = await generateImage(imgPromptValue);
        if (image) {
          await ctx.replyWithPhoto({ source: image });
          await ctx.telegram.editMessageText(
            genPlaceholder.chat.id,
            genPlaceholder.message_id,
            null,
            '🚀 Image generated'
          );
        } else {
          await ctx.telegram.editMessageText(
            genPlaceholder.chat.id,
            genPlaceholder.message_id,
            null,
            'Error generating image'
          );
        }
      } catch (err) {
        await ctx.telegram.editMessageText(
          genPlaceholder.chat.id,
          genPlaceholder.message_id,
          null,
          'Error generating image'
        );
      }
    } else {
      await ctx.telegram.editMessageText(
        genPlaceholder.chat.id,
        genPlaceholder.message_id,
        null,
        'Error generating image'
      );
    }
  }
}

export default textHandler;
