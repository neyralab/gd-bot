import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { Effect } from './types';
import { DataWrappedResponse, DefaultResponse } from './types/defaults';

interface IntroInfo {
  data: boolean;
}

export const checkIntro = async () => {
  const url = `${API_PATH}/intro`;
  const { data } =
    await axiosInstance.get<DataWrappedResponse<IntroInfo[]>>(url);
  return data.data;
};

export const sendIntroIsSeen = async () => {
  const url = `${API_PATH}/intro`;
  const { data } = await axiosInstance.post<Effect<DefaultResponse>>(url);
  return data;
};
