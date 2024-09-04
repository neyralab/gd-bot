import callLLMProvider from '../utils/callLLMProvider.js';
import errorTransformer from '../utils/errorTransformer.js';
import generateImage from '../utils/generateImage.js';
import logger from '../utils/logger.js';

const state = new Map();

async function textHandler(ctx) {
  const chatId = ctx.message.chat.id;
  const userId = ctx.from.id;
  const messageText = ctx.message.text;
  logger.info(`Incoming chat message`, {
    userId,
    chatId,
    incomingText: messageText
  });
  // Retrieve the chat history from state
  const data = state.get(chatId) || {};
  const chatHist = data?.chatHist ? data.chatHist.slice(-5) : [];
  const chatHistStr = chatHist.join('\n\n');

  try {
    // Send thinking message
    let thinkingMsg;
    try {
      thinkingMsg = await ctx.reply('⚡️ Thinking...');
    } catch (error) {
      logger.error('Error sending thinking message', {
        error: errorTransformer(error)
      });
      return;
    }

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
      logger.info(`Outgoing chat message`, {
        userId,
        chatId,
        response: textResponse.trim()
      });
      await ctx.telegram.editMessageText(
        thinkingMsg.chat.id,
        thinkingMsg.message_id,
        null,
        textResponse.trim(),
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      if (err.description === 'Bad Request: message is empty') {
        try {
          await ctx.telegram.editMessageText(
            thinkingMsg.chat.id,
            thinkingMsg.message_id,
            null,
            'Got it!'
          );
        } catch (editError) {
          logger.error('Error editing empty message', {
            editError: errorTransformer(editError)
          });
        }
        logger.error(`Outgoing chat message`, {
          userId,
          chatId,
          response: 'Bad Request: response message is empty',
          error: errorTransformer(err)
        });
      } else {
        try {
          await ctx.telegram.editMessageText(
            thinkingMsg.chat.id,
            thinkingMsg.message_id,
            null,
            textResponse.trim()
          );
        } catch (editError) {
          logger.error('Error editing message', {
            editError: errorTransformer(editError)
          });
        }
      }
    }

    // Handle image generation if imgPrompt is present
    if (imgPrompt) {
      let genPlaceholder;
      try {
        genPlaceholder = await ctx.reply('📸 Generating image...');
      } catch (error) {
        logger.error('Error sending image generation placeholder', {
          error: errorTransformer(error)
        });
        return;
      }

      if (imgPromptValue) {
        try {
          logger.info(`Incoming prompt for generation`, {
            userId,
            chatId,
            prompt: imgPromptValue
          });
          const image = await generateImage(imgPromptValue);
          if (image) {
            logger.info(`Outgoing generated image`, {
              userId,
              chatId,
              prompt: imgPromptValue,
              image: image.substring(0, 50) + '...'
            });
            try {
              await ctx.replyWithPhoto({ source: image });
            } catch (replyError) {
              logger.error('Error sending generated image', {
                replyError: errorTransformer(replyError)
              });
            }
            try {
              await ctx.telegram.editMessageText(
                genPlaceholder.chat.id,
                genPlaceholder.message_id,
                null,
                '🚀 Image generated'
              );
            } catch (editError) {
              logger.error('Error editing image generation message', {
                editError: errorTransformer(editError)
              });
            }
          } else {
            try {
              await ctx.telegram.editMessageText(
                genPlaceholder.chat.id,
                genPlaceholder.message_id,
                null,
                'Error generating image'
              );
            } catch (editError) {
              logger.error('Error editing image generation error message', {
                editError: errorTransformer(editError)
              });
            }
            logger.error(`Error in outgoing generated image`, {
              userId,
              chatId,
              prompt: imgPromptValue
            });
          }
        } catch (err) {
          try {
            await ctx.telegram.editMessageText(
              genPlaceholder.chat.id,
              genPlaceholder.message_id,
              null,
              'Error generating image'
            );
          } catch (editError) {
            logger.error('Error editing image generation error message', {
              editError: errorTransformer(editError)
            });
          }
          logger.error(`Error in outgoing generated image`, {
            userId,
            chatId,
            prompt: imgPromptValue
          });
        }
      } else {
        try {
          await ctx.telegram.editMessageText(
            genPlaceholder.chat.id,
            genPlaceholder.message_id,
            null,
            'Error generating image'
          );
        } catch (editError) {
          logger.error('Error editing image generation error message', {
            editError: errorTransformer(editError)
          });
        }
      }
    }
  } catch (err) {
    console.log('textHandler global err', err);
    try {
      await ctx.reply('An error occurred while processing your message.');
    } catch (replyError) {
      logger.error('Error sending error message', {
        replyError: errorTransformer(replyError)
      });
    }
  }
}

export default textHandler;
