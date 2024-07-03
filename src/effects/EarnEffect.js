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
    if (data?.message === 'success') {
      return 'success';
    } else {
      throw Error();
    }
  } catch (e) {
    return e?.response?.data?.errors;
  }
};
