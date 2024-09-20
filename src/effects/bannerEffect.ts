import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';

export const getBannersEffect = async () => {
  try {
    const { data } = await axiosInstance.get(`${API_PATH}/banners`);
    return data.data;
  } catch (error) {
    throw error;
  }
};
