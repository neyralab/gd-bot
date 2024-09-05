import OpenAI from 'openai';
import logger from './logger.js';
import errorTransformer from './errorTransformer.js';

const openrouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: `${process.env.OPENROUTER_KEY}`
});

const neyraClient = new OpenAI({
  baseURL: 'https://api.neyra.ai/api/v1',
  apiKey: `${process.env.NEYRA_CHAT_KEY}`
});

async function callLLMProvider(input, type = 'text') {
  try {
    if (type === 'text') {
      const completion = await neyraClient.chat.completions.create({
        max_tokens: 1512,
        model: 'neyra/1D',
        stream: false,
        messages: [
          {
            role: 'user',
            content: input
          }
        ]
      });
      let textResponse = completion.choices[0].message.content;
      textResponse = textResponse.replace('* **', '').replace('**', '');
      return textResponse;
    } else if (type === 'image') {
      const response = await openrouterClient.chat.completions.create({
        model: 'google/gemini-flash-1.5',
        stream: false,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What’s in this image?'
              },
              {
                type: 'image_url',
                image_url: {
                  url: input
                }
              }
            ]
          }
        ],
        max_tokens: 512
      });
      const textResponse = response.choices?.at(0)?.message.content;
      return textResponse;
    }
  } catch (error) {
    console.log(`Error calling LLM provider: ${error.message}`);
    logger.error('Error calling LLM provider', {
      error: errorTransformer(error)
    });
    return 'An error occurred while processing your request. Please try again later.';
  }
}

export default callLLMProvider;
