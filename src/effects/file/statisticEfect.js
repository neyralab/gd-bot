import { API_PATH } from '../../utils/api-urls';
import axiosInstance from '../axiosInstance';

export const sendFileViewStatistic = async (slug) => {
  try {
    const response = await axiosInstance.post(
      `${API_PATH}/statistic/${slug}/1`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
