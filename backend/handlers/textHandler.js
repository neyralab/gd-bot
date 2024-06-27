import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.neyra.ai/api/v1',
  apiKey: `${process.env.NEYRA_CHAT_KEY}`
});

async function textHandler(ctx) {
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
}

export default textHandler;
