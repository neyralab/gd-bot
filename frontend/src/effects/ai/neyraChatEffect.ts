import axios from 'axios';
import { API_NEYRA, NEYRA_CHAT_KEY } from '../../utils/api-urls';

export const sendMessageToAi = async (message: string) => {
  let data = JSON.stringify({
    language: 'en',
    request: message,
    stream: false
  });
  try {
    const res = axios.put<ISendMessageToAiRes>(
      `${API_NEYRA}/v1/chat/completions`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NEYRA_CHAT_KEY}`
        }
      }
    );
    return res;
  } catch (error) {
    console.error('Error in Neyra chat:', error);
    return error;
  }
};

interface ISendMessageToAiRes {
  data: {
    response: string;
  };
  id: number;
  message: string;
  model: string;
  status: string;
}
