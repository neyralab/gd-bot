import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { Effect } from './types';

interface IntroInfo {
  data: boolean;
}

interface SendIntroResponse {
  message: string;
}

export const checkIntro = async () => {
  const url = `${API_PATH}/intro`;
  const { data } = await axiosInstance.get<{ data: IntroInfo[] }>(url);
  return data.data;
};

export const sendIntroIsSeen = async () => {
  const url = `${API_PATH}/intro`;
  const { data } = await axiosInstance.post<Effect<SendIntroResponse>>(url);
  console.log(data);
  return data;
};
