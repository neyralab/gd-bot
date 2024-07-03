import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';

export const checkTgJoin = async () => {
  const url = `${API_PATH}/join/tg/channel`;

  try {
    const { data } = await axiosInstance.get(url);
    return data && data.message && data.message === 'success';
  } catch (e) {
    return false;
  }
};
export const checkTgChatJoin = async () => {
  const url = `${API_PATH}/join/tg/chat/channel`;

  try {
    const { data } = await axiosInstance.get(url);
    return data && data.message && data.message === 'success';
  } catch (e) {
    return false;
  }
};
