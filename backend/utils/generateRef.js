import crypto from 'node:crypto';

export const generateRef = (chat_id) => {
  const random = crypto.randomBytes(2).toString('hex');
  // const randomRadix = parseInt(random, 36);
  const id = Number(chat_id).toString(36);
  return `${id}${random}`;
};
