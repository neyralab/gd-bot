import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { Effect } from './types';
import { DefaultResponse } from './types/defaults';

interface AdvertisementVideoInfo {
  data: {
    id: number;
    created_at: string;
    duration: number;
    priority: number;
    video: string;
    name: string;
    is_active: boolean;
    points: number;
  };
  points: number;
}

export const getAdvertisementVideo = async () => {
  const url = `${API_PATH}/video`;
  const { data } = await axiosInstance.get<AdvertisementVideoInfo>(url);
  return data;
};

export const startWatchingAdvertisementVideo = async (videoId: string) => {
  const url = `${API_PATH}/start/watch`;
  const { data } = await axiosInstance.post<Effect<DefaultResponse>>(
    url,
    {
      video: videoId
    }
  );
  return data;
};

export const endWatchingAdvertisementVideo = async (videoId: string) => {
  const url = `${API_PATH}/end/watch`;
  const { data } = await axiosInstance.post<Effect<DefaultResponse>>(
    url,
    {
      video: videoId
    }
  );
  return data;
};
