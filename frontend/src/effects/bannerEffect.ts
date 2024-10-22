import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { AdvertisementBanner } from './types/banners';
import { DataWrappedResponse } from './types/defaults';

export const getBannersEffect = async () => {
  try {
    const { data } = await axiosInstance.get<
      DataWrappedResponse<AdvertisementBanner[]>
    >(`${API_PATH}/banners`);
    return data.data;
  } catch (error) {
    throw error;
  }
};
